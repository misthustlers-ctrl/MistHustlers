import { useState, useEffect, useMemo } from "react";
import SEO from "@/components/SEO";
import Breadcrumbs from "@/components/Breadcrumbs";
import SchemaMarkup from "@/components/SchemaMarkup";
import FAQItem from "@/components/FAQItem";
import { useAuth } from "@/auth/AuthProvider";
import {
  runAudit, revenueLeakEstimate, auditInsights, buildRoadmap, toCsv, downloadText, businessSummary,
  croRecommendations, srsDocument, srsToText, competitorGapSummary, buildCostEstimate,
  buildSrsBlueprint, srsBlueprintMd, competitorMatrix3, buildInvoice, buildROI,
  type AuditResult,
} from "@/utils/auditEngine";
import { buildAuditReportHtml } from "@/utils/auditReportPdf";
import {
  CheckCircle2, XCircle, Gauge, Download, FileText, TrendingUp, Loader2, Star, Zap,
  Target, CalculatorIcon, FileCheck2, Compass, Plus, Trash2, Search, MapPin, Building2,
  Filter, Phone, Mail, Globe2, ExternalLink, LogOut,
} from "lucide-react";

declare global {
  interface Window {
    __OVERRIDE_AUDIT_HTML__?: string;
  }
}

const HISTORY_KEY = "mh_audit_history_v1";
const TRACKED_KEY = "mh_audit_tracked_v1";
const MAX_TRACKED = 3;

type TrackedSite = { url: string; score: number | null; passed: number; total: number; updatedAt: string };

type LeadFinderResult = {
  id: string;
  businessName: string;
  niche: string;
  location: string;
  category: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  websiteStatus: "missing" | "social-only" | "listed";
  leadScore: number;
  priority: "A" | "B" | "C";
  reason: string;
  source: string;
  sourceUrl: string;
};

function normalizeLeadWebsite(value: string) {
  const cleaned = value.trim().replace(/[),.;]+$/g, "");
  if (!cleaned) return "";
  if (/^https?:\/\//i.test(cleaned)) return cleaned;
  if (/^[a-z0-9.-]+\.[a-z]{2,}(\/\S*)?$/i.test(cleaned)) return `https://${cleaned}`;
  return "";
}

function websiteGapStatus(website: string): LeadFinderResult["websiteStatus"] {
  if (!website) return "missing";
  let host = "";
  try {
    host = new URL(website.startsWith("http") ? website : `https://${website}`).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "missing";
  }
  const socialHosts = ["facebook.com", "fb.com", "instagram.com", "linktr.ee", "wa.me", "whatsapp.com", "youtube.com", "maps.google.com", "goo.gl"];
  return socialHosts.some((domain) => host === domain || host.endsWith(`.${domain}`)) ? "social-only" : "listed";
}

function scoreImportedLead(lead: Pick<LeadFinderResult, "phone" | "email" | "websiteStatus" | "address" | "businessName">) {
  let score = 22;
  if (lead.websiteStatus === "missing") score += 40;
  if (lead.websiteStatus === "social-only") score += 28;
  if (lead.phone) score += 16;
  if (lead.email) score += 12;
  if (lead.address) score += 6;
  if (lead.businessName) score += 8;
  return Math.min(100, score);
}

function parseGoogleMapsText(raw: string, niche: string, location: string, limit: number): LeadFinderResult[] {
  const text = raw.replace(/\r/g, "\n").trim();
  if (!text) return [];
  try {
    const parsed = JSON.parse(text);
    const rows = Array.isArray(parsed) ? parsed : Array.isArray(parsed.leads) ? parsed.leads : Array.isArray(parsed.results) ? parsed.results : [];
    if (rows.length) {
      return rows.map((row: any, index: number) => {
        const website = normalizeLeadWebsite(row.website || row.site || row.url || row.domain || "");
        const websiteStatus = row.websiteStatus || websiteGapStatus(website);
        const businessName = String(row.businessName || row.business_name || row.name || row.title || `Google Maps lead ${index + 1}`).trim();
        const address = String(row.address || row.full_address || row.location || "").trim();
        const phone = String(row.phone || row.phone_number || row.telephone || "").trim();
        const email = String(row.email || "").trim();
        const partial = { businessName, phone, email, websiteStatus, address };
        const leadScore = Number(row.leadScore) || scoreImportedLead(partial);
        const priority = row.priority === "A" || row.priority === "B" || row.priority === "C"
          ? row.priority
          : leadScore >= 70 ? "A" : leadScore >= 50 ? "B" : "C";
        return {
          id: String(row.id || `google-maps-json-${Date.now()}-${index}`),
          businessName,
          niche: String(row.niche || niche),
          location: String(row.location || location),
          category: String(row.category || row.type || niche || "business"),
          address,
          phone,
          email,
          website,
          websiteStatus,
          leadScore,
          priority,
          reason: String(row.reason || (websiteStatus === "missing" ? "no website in Google Maps result" : "Google Maps imported lead")),
          source: String(row.source || "Google Maps import"),
          sourceUrl: String(row.sourceUrl || row.maps_link || row.google_maps_url || row.link || `https://www.google.com/maps/search/${encodeURIComponent(`${businessName} ${location}`)}`),
        } satisfies LeadFinderResult;
      }).slice(0, limit);
    }
  } catch {
    /* plain-text import */
  }
  const blockCandidates = text
    .split(/\n\s*\n+/)
    .map((block) => block.split("\n").map((line) => line.trim()).filter(Boolean))
    .filter((block) => block.length);
  const blocks = blockCandidates.length > 1
    ? blockCandidates
    : text.split(/\n(?=[A-Z0-9][^\n]{2,80}\n(?:[0-9.]+|Open|Closed|Directions|Website|Call|[A-Za-z ]{3,}))/g)
        .map((block) => block.split("\n").map((line) => line.trim()).filter(Boolean))
        .filter((block) => block.length);

  const phoneRe = /(?:\+?91[\s-]?)?[6-9]\d(?:[\s-]?\d){8,}/;
  const emailRe = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
  const websiteRe = /(https?:\/\/[^\s]+|(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+\/?[^\s]*)/i;
  const skipNameRe = /^(open|closed|directions|website|call|save|share|reviews?|rating|sponsored|ad|route|hours?|menu|order online)$/i;
  const addressHintRe = /(road|rd|street|st|nagar|colony|market|complex|floor|shop|near|opp|madhya pradesh|maharashtra|india|\b\d{6}\b)/i;
  const seen = new Set<string>();

  return blocks
    .map((lines, index) => {
      const phone = lines.find((line) => phoneRe.test(line))?.match(phoneRe)?.[0]?.trim() || "";
      const email = lines.find((line) => emailRe.test(line))?.match(emailRe)?.[0]?.trim() || "";
      const websiteLine = lines.find((line) => websiteRe.test(line) && !/google\.(com|co\.in)\/maps|maps\.app\.goo\.gl/i.test(line)) || "";
      const website = normalizeLeadWebsite(websiteLine.match(websiteRe)?.[0] || "");
      const name = lines.find((line) => {
        if (skipNameRe.test(line)) return false;
        if (phoneRe.test(line) || emailRe.test(line) || websiteRe.test(line)) return false;
        if (/^[0-9.]+(\s*\(\d+\))?$/.test(line)) return false;
        return line.length >= 3 && line.length <= 90;
      }) || `Imported lead ${index + 1}`;
      const category = lines.find((line) => line !== name && !skipNameRe.test(line) && !phoneRe.test(line) && !emailRe.test(line) && !websiteRe.test(line) && line.length <= 70) || niche;
      const address = lines.find((line) => addressHintRe.test(line) && !phoneRe.test(line) && !emailRe.test(line) && !websiteRe.test(line)) || "";
      const websiteStatus = websiteGapStatus(website);
      const partial = { businessName: name, phone, email, websiteStatus, address };
      const leadScore = scoreImportedLead(partial);
      const reasonParts = [
        websiteStatus === "missing" ? "no website found in pasted Maps text" : websiteStatus === "social-only" ? "social-only link found" : "website listed",
        phone ? "phone available" : "",
        email ? "email available" : "",
        address ? "address available" : "",
      ].filter(Boolean);
      return {
        id: `google-maps-import-${Date.now()}-${index}`,
        businessName: name,
        niche,
        location,
        category,
        address,
        phone,
        email,
        website,
        websiteStatus,
        leadScore,
        priority: leadScore >= 70 ? "A" : leadScore >= 50 ? "B" : "C",
        reason: reasonParts.join("; "),
        source: "Google Maps import",
        sourceUrl: `https://www.google.com/maps/search/${encodeURIComponent(`${name} ${location}`)}`,
      } satisfies LeadFinderResult;
    })
    .filter((lead) => {
      const key = `${lead.businessName.toLowerCase()}|${lead.phone}|${lead.address.toLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return !!lead.businessName && lead.businessName.length > 2;
    })
    .sort((a, b) => b.leadScore - a.leadScore || a.businessName.localeCompare(b.businessName))
    .slice(0, limit);
}

const LEAD_NICHES = [
  "dental clinic",
  "medical clinic",
  "salon",
  "gym",
  "coaching institute",
  "restaurant",
  "hotel",
  "real estate agency",
  "interior designer",
  "manufacturer",
  "exporter",
  "travel agency",
];

const LEAD_FILTERS = [
  { value: "missing-website", label: "No website only" },
  { value: "missing-or-social", label: "No website or social-only" },
  { value: "missing-with-phone", label: "No website + phone" },
  { value: "contact-ready", label: "No website + contact" },
  { value: "with-phone", label: "Contactable leads" },
  { value: "all", label: "All public listings" },
] as const;

const COST_EXTRAS: Record<string, string> = {
  blog: "Blog / Content section",
  store: "Product store (e-commerce)",
  multilingual: "Multilingual (Hindi/EN)",
  cms: "CMS for self-managed content updates",
  maintenance: "Monthly maintenance plan",
};

const SEO_AUDIT_FAQS = [
  {
    question: "How does this free SEO checker work?",
    answer: "Enter your website URL and the tool runs a 14-point on-page audit covering title, meta description, heading structure, schema markup, Open Graph, mobile viewport, image alt tags, and content quality. Every check gets a PASS/FAIL status and a final growth score. Reports are saved in your browser only.",
  },
  {
    question: "How is my Growth Score calculated?",
    answer: "The Growth Score (0-100) is calculated from weighted SEO checks. 80+ means strong on-page optimization, 50-80 is average, and below 50 means critical fixes are needed. The report also includes a revenue leak estimate and a 30/60/90-day roadmap.",
  },
  {
    question: "Is the SEO audit tool completely free?",
    answer: "Yes. The 14-point audit, score, check breakdown, priority fixes, roadmap, SRS planner, competitor comparison, cost calculator, browser history, CSV, JSON, and PDF report are available in one free tool.",
  },
  {
    question: "Do you need my website HTML or password?",
    answer: "No. The free audit only checks public website data. No code, login, or password is required. Reports are generated in-browser and are not saved to a server.",
  },
  {
    question: "What should I do if I need detailed SEO improvements?",
    answer: "After the free audit, you can send the report to our team with your email address. Our SEO experts will review the best fixes and contact you on WhatsApp or email with a quote.",
  },
];

const SEO_AUDIT_HOW_TO_STEPS = [
  {
    name: "Enter your website URL",
    text: "Paste the public URL of the page you want to audit. The server-side audit fetcher reads and renders the page before scoring it.",
  },
  {
    name: "Run the 14-point SEO audit",
    text: "The checker reviews technical SEO, on-page metadata, headings, schema markup, social previews, mobile setup, image alt text, and content depth.",
  },
  {
    name: "Review the SEO score and priority fixes",
    text: "Use the score, failed checks, revenue leak estimate, and roadmap to decide which fixes should be completed first.",
  },
];

const SEO_CHECKS = [
  "Title tag length and keyword clarity",
  "Meta description quality",
  "Single H1 heading check",
  "Canonical URL validation",
  "Open Graph preview tags",
  "Twitter/X card setup",
  "JSON-LD schema markup",
  "Image alt text coverage",
  "Heading hierarchy",
  "Mobile viewport readiness",
  "HTML language targeting",
  "Robots indexing status",
  "Internal link structure",
  "Content depth and thin-page risk",
];

const AUDIT_LOADING_STEPS = [
  {
    key: "server",
    title: "Fetch website HTML",
    description: "The audit server requests the public page source so browser CORS does not block the scan.",
  },
  {
    key: "checks",
    title: "Run SEO checks",
    description: "Title, meta, H1, schema, Open Graph, robots, internal links, mobile viewport, alt text, and content depth are checked.",
  },
  {
    key: "score",
    title: "Build report",
    description: "A growth score, failed checks, priority fixes, roadmap, and export-ready report are prepared.",
  },
];

function loadHistory(): AuditResult[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]") as AuditResult[];
  } catch {
    return [];
  }
}

function loadTracked(): TrackedSite[] {
  try {
    const raw = JSON.parse(localStorage.getItem(TRACKED_KEY) || "[]");
    return Array.isArray(raw) ? (raw as TrackedSite[]).slice(0, MAX_TRACKED) : [];
  } catch {
    return [];
  }
}

function scoreScore(score: number) {
  if (score >= 80) return { text: "text-emerald-600", label: "Strong" };
  if (score >= 50) return { text: "text-amber-600", label: "Average" };
  return { text: "text-red-600", label: "Weak" };
}

function checksSummary(checks: AuditResult["checks"]) {
  return checks.map((c) => `${c.passed ? "PASS" : "FAIL"} | ${c.label} | ${c.detail}`).join("\n");
}

function insightSummary(insights: { issue: string; fix: string }[]) {
  return insights.map((i) => `→ ${i.issue}\n   Fix: ${i.fix}`).join("\n");
}

function auditStepIndex(status: string) {
  const value = status.toLowerCase();
  if (value.includes("complete")) return AUDIT_LOADING_STEPS.length;
  if (value.includes("running seo")) return 1;
  if (value.includes("build report") || value.includes("export")) return 2;
  return 0;
}

function AuditLoadingScreen({
  status,
  target,
  error,
  running,
  onClose,
}: {
  status: string;
  target: string;
  error: string;
  running: boolean;
  onClose: () => void;
}) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const failed = !!error && !running;
  const activeIndex = auditStepIndex(status);
  const progress = failed ? Math.min(85, Math.max(20, ((activeIndex + 1) / AUDIT_LOADING_STEPS.length) * 100)) : Math.min(100, Math.max(12, ((activeIndex + 1) / AUDIT_LOADING_STEPS.length) * 100));

  useEffect(() => {
    if (!running) return;
    setElapsedSeconds(0);
    const id = window.setInterval(() => setElapsedSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(id);
  }, [running]);

  return (
    <div className="fixed inset-0 z-[80] overflow-x-hidden overflow-y-auto bg-abyssal-ink text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,91,0,0.22),transparent_32%),radial-gradient(circle_at_85%_25%,rgba(124,58,237,0.18),transparent_30%)]" />
      <div className="relative flex min-h-screen items-center px-4 py-8 sm:px-6">
        <div className="mx-auto w-full max-w-[1060px]">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] ${failed ? "border-red-300/30 bg-red-500/10 text-red-200" : "border-digital-orange/30 bg-digital-orange/10 text-digital-orange"}`}>
                {failed ? <XCircle className="h-3.5 w-3.5" /> : <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {failed ? "Audit Stopped" : "Audit Running"}
              </span>
              <h2 className="mt-5 font-display text-[clamp(34px,6vw,64px)] font-bold leading-[1.02]">
                {failed ? "Website fetch was blocked" : "Scanning your website now"}
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-white/65">
                {failed
                  ? "The audit could not read the website source automatically, so no report or export can be generated yet."
                  : "Keep this tab open while the audit checks the page source, SEO structure, social preview tags, content quality, and report data."}
              </p>
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">Website</p>
                <p className="mt-1 break-all font-mono text-sm text-white">{target || "Waiting for URL"}</p>
              </div>
              <div className="mt-5">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.16em] text-white/45">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-digital-orange transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
                <p className="mt-2 text-xs text-white/40">
                  {failed ? "Stopped before export generation." : `Elapsed: ${elapsedSeconds}s. Website fetching can take up to 35 seconds.`}
                </p>
              </div>
            </div>

            <div className="min-w-0 rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/30 backdrop-blur">
              <div className={`flex items-start gap-3 rounded-2xl border p-4 ${failed ? "border-red-300/25 bg-red-500/10" : "border-digital-orange/25 bg-digital-orange/10"}`}>
                {failed ? <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-200" /> : <Gauge className="mt-0.5 h-5 w-5 shrink-0 text-digital-orange" />}
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white">{failed ? "What happened" : "Current action"}</p>
                  <p className="mt-1 break-words text-sm text-white/70">{failed ? error : status || "Preparing audit..."}</p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {AUDIT_LOADING_STEPS.map((step, index) => {
                  const done = activeIndex > index;
                  const active = activeIndex === index;
                  return (
                    <div
                      key={step.key}
                      className={`flex gap-3 rounded-2xl border p-4 transition ${
                        active && !failed
                          ? "border-digital-orange/45 bg-digital-orange/10"
                          : done
                            ? "border-emerald-400/25 bg-emerald-400/10"
                            : failed && active
                              ? "border-red-300/30 bg-red-500/10"
                            : "border-white/10 bg-white/[0.03]"
                      }`}
                    >
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${
                        done
                          ? "border-emerald-400 bg-emerald-400 text-abyssal-ink"
                          : failed && active
                            ? "border-red-200 text-red-200"
                          : active && !failed
                              ? "border-digital-orange text-digital-orange"
                              : "border-white/15 text-white/40"
                      }`}>
                        {done ? <CheckCircle2 className="h-4 w-4" /> : failed && active ? <XCircle className="h-4 w-4" /> : active ? <Loader2 className="h-4 w-4 animate-spin" /> : <span className="text-xs font-bold">{index + 1}</span>}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white">{step.title}</p>
                        <p className="mt-1 text-xs leading-relaxed text-white/55">{step.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="mt-4 text-xs leading-relaxed text-white/45">
                The audit uses the server-side fetcher first and then a headless browser renderer for JavaScript-heavy pages.
              </p>
              {failed && (
                <div className="mt-5">
                  <button
                    type="button"
                    onClick={onClose}
                    className="min-h-11 rounded-xl border border-white/15 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                  >
                    Back to audit form
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CompMatrix({ result, cmp1, cmp2 }: { result: AuditResult; cmp1: AuditResult | null; cmp2: AuditResult | null }) {
  type MatrixRow =
    | { kind: "head" | "score" | "data"; label: string; values: (string | number)[] }
    | { kind: "verdict"; label: string };
  const matrix = useMemo<{ rows: MatrixRow[]; verdict: string; scores: number[] } | null>(() => {
    if (cmp1 && cmp2) {
      const m = competitorMatrix3(result, cmp1, cmp2);
      return { rows: m.rows as MatrixRow[], verdict: m.verdict, scores: m.scores };
    }
    const other = cmp1 ?? cmp2;
    if (!other) return null;
    const gap = competitorGapSummary(result, other);
    return {
      rows: [
        { kind: "head", label: "", values: ["Your Site", other.url] },
        { kind: "score", label: "Score", values: [result.score, other.score] },
        { kind: "verdict", label: gap.verdict },
        ...gap.gaps.map((g) => ({ kind: "data" as const, label: g.label, values: ["✗", "✓"] })),
      ],
      verdict: gap.verdict,
      scores: [result.score, other.score],
    };
  }, [result, cmp1, cmp2]);

  if (!matrix) return null;
  return (
    <div className="mt-5 overflow-x-auto rounded-2xl border border-abyssal-ink/10">
      <table className="min-w-[620px] w-full text-left text-sm">
        <thead>
          <tr className="bg-abyssal-ink text-white">
            {matrix.rows[0].kind !== "verdict" && matrix.rows[0].values.map((v, i) => (
              <th key={i} className="px-4 py-3 text-xs font-semibold tracking-wide capitalize">{String(v)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.rows.slice(1).map((row, i) => (
            <tr key={i} className="border-t border-abyssal-ink/10">
              {row.kind === "head" || row.kind === "score" || row.kind === "data" ? (
                <>
                  <td className="px-4 py-2.5 font-semibold text-abyssal-ink/75">{row.label}</td>
                  {row.values.map((v, j) => (
                    <td key={j} className={`break-words px-4 py-2.5 ${row.kind === "score" ? (Number(v) === Math.max(...(matrix.scores)) ? "font-display text-lg font-bold text-emerald-600" : "font-display text-lg font-bold text-abyssal-ink") : String(v) === "✓" ? "text-emerald-600" : "text-red-500"}`}>{String(v)}</td>
                  ))}
                </>
              ) : (
                <td colSpan={matrix.rows[0].kind !== "verdict" ? matrix.rows[0].values.length + (matrix.rows[0].kind === "head" ? 0 : 1) : 3} className="bg-abyssal-ink/5 px-4 py-3 text-center font-display text-sm font-bold text-abyssal-ink">{row.label}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ToggleExtras({ label, checked, onClick }: { label: string; checked: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-left text-sm font-semibold transition ${checked ? "border-emerald-600 bg-emerald-50 text-emerald-800" : "border-abyssal-ink/15 bg-white text-abyssal-ink/70"}`}
    >
      <span className={`block h-3.5 w-3.5 rounded border ${checked ? "border-emerald-600 bg-emerald-600" : "border-abyssal-ink/25"}`} />
      {label}
    </button>
  );
}

export default function SeoAudit() {
  const { user, signOut, getAccessToken } = useAuth();
  const [url, setUrl] = useState("");
  const [traffic, setTraffic] = useState("1000");
  const [pasteMode, setPasteMode] = useState(false);
  const [pastedHtml, setPastedHtml] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [auditScreenOpen, setAuditScreenOpen] = useState(false);
  const [auditStatus, setAuditStatus] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<AuditResult | null>(null);
  const [history, setHistory] = useState<AuditResult[]>([]);
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadStatus, setLeadStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [trackedSites, setTrackedSites] = useState<TrackedSite[]>(loadTracked);
  const [trackedUrl, setTrackedUrl] = useState("");
  const [trackedError, setTrackedError] = useState("");
  const [trackingIndex, setTrackingIndex] = useState<number | null>(null);
  const [leadFinderNiche, setLeadFinderNiche] = useState("dental clinic");
  const [leadFinderLocation, setLeadFinderLocation] = useState("Indore");
  const [leadFinderCount, setLeadFinderCount] = useState("50");
  const [leadFinderFilter, setLeadFinderFilter] = useState<(typeof LEAD_FILTERS)[number]["value"]>("missing-website");
  const [leadFinderStatus, setLeadFinderStatus] = useState("");
  const [leadFinderError, setLeadFinderError] = useState("");
  const [leadFinderLoading, setLeadFinderLoading] = useState(false);
  const [leadFinderResults, setLeadFinderResults] = useState<LeadFinderResult[]>([]);
  const [leadFinderSourceNote, setLeadFinderSourceNote] = useState("");
  const [googleMapsImport, setGoogleMapsImport] = useState("");

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(TRACKED_KEY, JSON.stringify(trackedSites.slice(0, MAX_TRACKED)));
    } catch {
      /* ignore */
    }
  }, [trackedSites]);

  const insights = useMemo(() => (result ? auditInsights(result.checks) : []), [result]);
  const leak = useMemo(
    () => (result ? revenueLeakEstimate(result.score, Number(traffic) || 0) : null),
    [result, traffic]
  );
  const roadmap = useMemo(() => buildRoadmap(insights), [insights]);
  const auditTarget = url.trim();
  const siteName = useMemo(() => {
    try {
      return result ? new URL(result.url).hostname.replace(/^(www\.)?/, "") : "";
    } catch {
      return result?.url || "";
    }
  }, [result]);
  const businessSummaryMemo = useMemo(
    () => (result ? businessSummary(result, leak, insights) : null),
    [result, leak, insights]
  );
  const visibleHistory = history;
  const leadFinderSummary = useMemo(() => {
    const total = leadFinderResults.length;
    const noWebsite = leadFinderResults.filter((lead) => lead.websiteStatus === "missing").length;
    const socialOnly = leadFinderResults.filter((lead) => lead.websiteStatus === "social-only").length;
    const contactReady = leadFinderResults.filter((lead) => lead.phone || lead.email).length;
    const priorityA = leadFinderResults.filter((lead) => lead.priority === "A").length;
    return { total, noWebsite, socialOnly, contactReady, priorityA };
  }, [leadFinderResults]);

  const croTips = useMemo(() => (result ? croRecommendations(result.checks) : []), [result]);
  const srs = useMemo(() => (result ? srsDocument(result, siteName) : null), [result, siteName]);
  const srsBlueprint = useMemo(() => (srs ? buildSrsBlueprint(srs) : null), [srs]);
  const [competitorUrl, setCompetitorUrl] = useState("");
  const [competitorResult, setCompetitorResult] = useState<AuditResult | null>(null);
  const [competitorUrl2, setCompetitorUrl2] = useState("");
  const [competitorResult2, setCompetitorResult2] = useState<AuditResult | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [competitorError, setCompetitorError] = useState("");
  const [costInput, setCostInput] = useState<{ pages: "landing" | "business" | "corporate"; extras: string[] }>({ pages: "business", extras: [] });
  const costEstimate = useMemo(() => buildCostEstimate(costInput), [costInput]);
  const invoice = useMemo(() => (costEstimate ? buildInvoice(costEstimate) : null), [costEstimate]);
  const roi = useMemo(() => (invoice ? buildROI(invoice, Number(traffic) || 0, result?.score ?? 50) : null), [invoice, traffic, result?.score]);

  function saveHistory(next: AuditResult[]) {
    setHistory(next);
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next.slice(0, 40)));
    } catch {
      /* ignore */
    }
  }

  async function handleRun(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setAuditStatus("Preparing audit...");
    setAuditScreenOpen(true);
    setIsRunning(true);
    setResult(null);
    try {
      if (pasteMode) {
        if (!pastedHtml.trim() || pastedHtml.trim().length < 120) {
          throw new Error("Paste the page source HTML first. It should be at least 120 characters.");
        }
        window.__OVERRIDE_AUDIT_HTML__ = pastedHtml;
      } else {
        delete window.__OVERRIDE_AUDIT_HTML__;
      }
      const accessToken = await getAccessToken();
      const r = await runAudit(url, `~${traffic || "1000"} visitors/mo`, setAuditStatus, accessToken);
      setAuditStatus("Audit complete.");
      setResult(r);
      saveHistory([r, ...history]);
      setAuditScreenOpen(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Audit failed. Please try again.";
      setError(message);
      setAuditStatus("Audit stopped before report generation.");
    } finally {
      delete window.__OVERRIDE_AUDIT_HTML__;
      setIsRunning(false);
    }
  }

  function closeAuditScreen() {
    setAuditScreenOpen(false);
  }

  async function compareCompetitor(target: 1 | 2) {
    setCompetitorError("");
    const url = target === 1 ? competitorUrl : competitorUrl2;
    const setResult = target === 1 ? setCompetitorResult : setCompetitorResult2;
    if (!url.trim()) {
      setCompetitorError(`Enter competitor ${target} URL.`);
      return;
    }
    setIsComparing(true);
    try {
      const accessToken = await getAccessToken();
      const r = await runAudit(url.trim(), "competitor", undefined, accessToken);
      setResult(r);
    } catch (err) {
      setCompetitorError(err instanceof Error ? err.message : "Comparison failed.");
    } finally {
      setIsComparing(false);
    }
  }

  function toggleCostExtra(key: string) {
    setCostInput((s) => ({
      ...s,
      extras: s.extras.includes(key) ? s.extras.filter((k) => k !== key) : [...s.extras, key],
    }));
  }

  async function addTrackedSite(e: React.FormEvent) {
    e.preventDefault();
    if (!trackedUrl.trim()) {
      setTrackedError("Enter a URL first.");
      return;
    }
    if (trackedSites.length >= MAX_TRACKED) {
      setTrackedError(`You can track up to ${MAX_TRACKED} sites. Remove one site first.`);
      return;
    }
    setTrackedError("");
    setTrackingIndex(trackedSites.length);
    try {
      const accessToken = await getAccessToken();
      const r = await runAudit(trackedUrl.trim(), `~${traffic || "1000"} visitors/mo`, undefined, accessToken);
      setTrackedSites((prev) => [...prev, { url: r.url, score: r.score, passed: r.passed, total: r.total, updatedAt: r.createdAt }]);
      setTrackedUrl("");
    } catch (err) {
      setTrackedError(err instanceof Error ? err.message : "Audit failed. Please try again.");
    } finally {
      setTrackingIndex(null);
    }
  }

  async function reAuditTracked(idx: number) {
    const site = trackedSites[idx];
    if (!site) return;
    setTrackedError("");
    setTrackingIndex(idx);
    try {
      const accessToken = await getAccessToken();
      const r = await runAudit(site.url, `~${traffic || "1000"} visitors/mo`, undefined, accessToken);
      setTrackedSites((prev) => prev.map((s, i) => (i === idx ? { url: r.url, score: r.score, passed: r.passed, total: r.total, updatedAt: r.createdAt } : s)));
    } catch (err) {
      setTrackedError(err instanceof Error ? err.message : "Re-audit failed.");
    } finally {
      setTrackingIndex(null);
    }
  }

  function removeTracked(idx: number) {
    setTrackedSites((prev) => prev.filter((_, i) => i !== idx));
    setTrackingIndex((cur) => (cur === idx ? null : cur));
  }

  async function findLeads(e: React.FormEvent) {
    e.preventDefault();
    setLeadFinderError("");
    setLeadFinderSourceNote("");
    setLeadFinderStatus("Checking location and public business data...");
    setLeadFinderLoading(true);
    setLeadFinderResults([]);

    try {
      const count = Math.max(1, Math.min(Number.parseInt(leadFinderCount, 10) || 50, 500));
      let data: any = null;
      for (let attempt = 0; attempt < 8; attempt += 1) {
        const res = await fetch("/api/find-leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            niche: leadFinderNiche,
            location: leadFinderLocation,
            count,
            filter: leadFinderFilter,
          }),
        });
        const text = await res.text();
        try {
          data = text ? JSON.parse(text) : null;
        } catch {
          throw new Error(`Lead Finder returned a non-JSON response (${res.status}). Check Netlify API redirects and latest deployment.`);
        }
        if (data?.queued) {
          const retryAfter = Math.max(5, Math.min(Number(data.retryAfterSeconds) || 15, 120));
          setLeadFinderStatus(`Lead Finder is busy. Queue position ${data.position || attempt + 1}. Retrying in ${retryAfter}s...`);
          await new Promise((resolve) => window.setTimeout(resolve, retryAfter * 1000));
          continue;
        }
        if (!res.ok || !data.ok) {
          throw new Error(data.error || "Lead search failed.");
        }
        break;
      }
      if (!data?.ok) {
        throw new Error("Lead Finder queue is busy. Please try again in a few minutes.");
      }
      setLeadFinderResults(Array.isArray(data.leads) ? data.leads : []);
      setLeadFinderSourceNote(data.leadSourceNote || "");
      setLeadFinderStatus(`Found ${data.returned || 0} matching leads from public map data.`);
    } catch (err) {
      setLeadFinderError(err instanceof Error ? err.message : "Lead search failed. Try a smaller count or another city.");
      setLeadFinderStatus("Lead search stopped.");
    } finally {
      setLeadFinderLoading(false);
    }
  }

  function exportLeadCsv() {
    if (!leadFinderResults.length) return;
    downloadText(`mh-leads-${Date.now()}.csv`, leadsToCsv(leadFinderResults), "text/csv;charset=utf-8");
  }

  function exportLeadJson() {
    if (!leadFinderResults.length) return;
    downloadText(`mh-leads-${Date.now()}.json`, JSON.stringify(leadFinderResults, null, 2), "application/json");
  }

  async function importGoogleMapsLeads() {
    setLeadFinderError("");
    const count = Math.max(1, Math.min(Number.parseInt(leadFinderCount, 10) || 50, 500));
    const imported = parseGoogleMapsText(googleMapsImport, leadFinderNiche, leadFinderLocation, count);
    if (!imported.length) {
      setLeadFinderError("No Google Maps leads could be parsed. Paste the JSON output from npm run leads:google or copied Maps listing text.");
      setLeadFinderStatus("Google Maps import stopped.");
      return;
    }
    setLeadFinderLoading(true);
    setLeadFinderStatus(`Importing ${imported.length} Google Maps leads into shared cache...`);
    try {
      const res = await fetch("/api/import-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          niche: leadFinderNiche,
          location: leadFinderLocation,
          filter: leadFinderFilter,
          leads: imported,
        }),
      });
      const text = await res.text();
      let data: any = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        throw new Error(`Lead import returned a non-JSON response (${res.status}). Check Netlify API redirects and latest deployment.`);
      }
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Lead import failed.");
      }
      const next = Array.isArray(data.leads) && data.leads.length ? data.leads : imported;
      setLeadFinderResults(next);
      setLeadFinderSourceNote(`Saved ${data.saved || imported.length} Google Maps leads to shared cache. Future users with the same niche/location can reuse this data without scraping again.`);
      setLeadFinderStatus(`Imported ${next.length} cached leads. Review priority, contact, and website gap before outreach.`);
    } catch (err) {
      setLeadFinderResults(imported);
      setLeadFinderError(err instanceof Error ? err.message : "Lead import failed, showing local parsed leads only.");
      setLeadFinderSourceNote("Showing local parsed leads only. Shared cache was not updated.");
    } finally {
      setLeadFinderLoading(false);
    }
  }

  async function submitAuditLead(e: React.FormEvent) {
    e.preventDefault();
    if (!result) return;
    if (!leadEmail.trim() || !/^\S+@\S+\.\S+$/.test(leadEmail.trim())) {
      setLeadStatus("error");
      return;
    }
    setLeadStatus("sending");
    try {
      const params = new URLSearchParams();
      params.set("form-name", "mh-seo-audit-lead");
      params.set("name", leadName.trim());
      params.set("email", leadEmail.trim());
      params.set("tier", "full-free-audit");
      params.set("audited-url", result.url);
      params.set("score", `${result.score}/100`);
      params.set("passed", `${result.passed}/${result.total}`);
      params.set("traffic", result.trafficHint);
      params.set("revenue-leak-inr", leak ? `₹${leak.perYearInr.toLocaleString("en-IN")}/year` : "n/a");
      params.set("checks", checksSummary(result.checks));
      params.set("priority-fixes", insightSummary(insights));
      params.set("roadmap", JSON.stringify(roadmap));

      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });
      if (!res.ok) throw new Error(`Netlify Forms responded ${res.status}`);
      setLeadStatus("sent");
      setLeadName("");
      setLeadEmail("");
    } catch {
      setLeadStatus("error");
    }
  }



  function exportCsv() {
    const all = history.length ? history : result ? [result] : [];
    if (!all.length) return;
    void toCsv(all).then((csv) => downloadText(`mh-seo-audit-${Date.now()}.csv`, csv, "text/csv;charset=utf-8"));
  }

  function exportJson() {
    const data = result ?? history[0];
    if (!data) return;
    downloadText(`mh-seo-audit-${Date.now()}.json`, JSON.stringify(data, null, 2), "application/json");
  }

function openPrintReport() {
    if (!result) return;
    const w = window.open("", "_blank", "width=1200,height=800");
    if (!w) {
      setError("Popup was blocked. Allow popups in your browser or use Print to save the PDF.");
      return;
    }
    const html = buildAuditReportHtml({
      result,
      leak,
      traffic,
      insights,
      roadmap,
      siteName,
    });
    w.document.open();
    w.document.write(html);
    w.document.close();
  }

  return (
    <>
      <SEO page="seoAudit" />
      <SchemaMarkup
        page="seoAudit"
        faq={SEO_AUDIT_FAQS}
        howToName="How to run a free website SEO audit"
        howToSteps={SEO_AUDIT_HOW_TO_STEPS}
        article={{
          headline: "Free SEO Audit Tool and Website SEO Checker",
          description: "A free 14-point website SEO checker for on-page SEO, technical SEO basics, schema markup, social previews, mobile setup, and content quality.",
          datePublished: "2026-08-17",
          dateModified: "2026-08-17",
          wordCount: 950,
        }}
      />
      <Breadcrumbs />
      <main id="main-content" className="overflow-x-hidden">
        {/* Netlify Forms declaration — must exist in static HTML at deploy time */}
        <form name="mh-seo-audit-lead" data-netlify="true" data-netlify-honeypot="bot-field" hidden aria-hidden="true">
          <input type="hidden" name="form-name" value="mh-seo-audit-lead" />
          <input type="hidden" name="bot-field" />
          <input type="hidden" name="name" />
          <input type="hidden" name="email" />
          <input type="hidden" name="tier" />
          <input type="hidden" name="audited-url" />
          <input type="hidden" name="score" />
          <input type="hidden" name="passed" />
          <input type="hidden" name="traffic" />
          <input type="hidden" name="revenue-leak-inr" />
          <input type="hidden" name="checks" />
          <input type="hidden" name="priority-fixes" />
          <input type="hidden" name="roadmap" />
        </form>
        <section className="pt-16 pb-10 md:pt-24">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-digital-orange/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-digital-orange">
              <Zap className="h-3.5 w-3.5" /> Free Website Audit Studio
            </span>
            <h1 className="mt-4 font-display text-[clamp(34px,5vw,54px)] font-bold leading-[1.05] tracking-[0.01em] text-abyssal-ink">
              Free Website SEO Checker &amp; Audit Tool
            </h1>
            <p className="mt-4 max-w-2xl font-body text-lg text-abyssal-ink/55">
              Enter any website URL and run a free 14-point SEO audit for on-page SEO, technical SEO basics, schema markup, mobile readiness, social previews, and content depth.
              Get a website SEO score, priority fixes, and exportable reports in CSV, JSON, or PDF.
            </p>

            <div className="mt-6 flex flex-col gap-3 rounded-3xl border border-abyssal-ink/10 bg-white/75 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                {user?.user_metadata?.avatar_url ? (
                  <img
                    src={String(user.user_metadata.avatar_url)}
                    alt=""
                    className="h-11 w-11 shrink-0 rounded-full border border-abyssal-ink/10 object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-digital-orange/10 text-sm font-bold text-digital-orange">
                    {(user?.email || "U").charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-abyssal-ink">
                    {String(user?.user_metadata?.full_name || user?.email || "Signed-in user")}
                  </p>
                  <p className="truncate text-xs text-abyssal-ink/45">{user?.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => void signOut().catch((err: unknown) => setError(err instanceof Error ? err.message : "Logout failed."))}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-abyssal-ink/15 px-4 py-2 text-xs font-bold text-abyssal-ink transition hover:bg-ash-white"
              >
                <LogOut className="h-3.5 w-3.5" /> Logout
              </button>
            </div>

            <form onSubmit={handleRun} className="mt-8 rounded-3xl border border-digital-orange/20 bg-white p-5 shadow-xl shadow-digital-orange/5">
              <div className="flex flex-col gap-3 md:flex-row">
                <div className="flex-1 rounded-2xl border border-abyssal-ink/10 bg-ash-white px-4 py-3 focus-within:border-digital-orange/60">
                  <label htmlFor="audit-url" className="block text-[10px] font-bold uppercase tracking-[0.18em] text-abyssal-ink/40">Website URL</label>
                  <input
                    id="audit-url"
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="mishtustlers.in"
                    className="w-full bg-transparent text-base font-mono text-abyssal-ink outline-none placeholder:text-abyssal-ink/30"
                    disabled={isRunning}
                    required
                  />
                </div>
                <div className="rounded-2xl border border-abyssal-ink/10 bg-ash-white px-4 py-3 md:w-44">
                  <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-abyssal-ink/40">Visitors/mo</span>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={traffic}
                    onChange={(e) => setTraffic(e.target.value)}
                    className="w-full bg-transparent text-base font-mono text-abyssal-ink outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isRunning}
                  className="flex items-center justify-center gap-2 rounded-full bg-digital-orange px-8 py-4 text-sm font-bold text-white shadow-lg transition-transform hover:scale-[1.02] disabled:opacity-60"
                >
                  {isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Gauge className="h-4 w-4" />}
                  {isRunning ? "Auditing..." : "Run Audit"}
                </button>
              </div>
              <div className="mt-4 rounded-2xl border border-abyssal-ink/10 bg-ash-white p-4">
                <label className="flex items-start gap-3 text-sm font-semibold text-abyssal-ink">
                  <input
                    type="checkbox"
                    checked={pasteMode}
                    onChange={(e) => setPasteMode(e.target.checked)}
                    disabled={isRunning}
                    className="mt-1 h-4 w-4 accent-digital-orange"
                  />
                  <span>
                    Paste HTML mode
                    <span className="block text-xs font-normal leading-relaxed text-abyssal-ink/50">
                      Use this when the website blocks server/browser audit requests. Open the site, view page source, paste it here, then run the same audit.
                    </span>
                  </span>
                </label>
                {pasteMode && (
                  <textarea
                    value={pastedHtml}
                    onChange={(e) => setPastedHtml(e.target.value)}
                    disabled={isRunning}
                    placeholder="Paste full page source HTML here..."
                    className="mt-3 min-h-40 w-full resize-y rounded-xl border border-abyssal-ink/10 bg-white px-4 py-3 font-mono text-xs leading-relaxed text-abyssal-ink outline-none focus:border-digital-orange/60"
                  />
                )}
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-abyssal-ink/50">
                <span>{pasteMode ? "Pasted HTML is scored in this browser and is not sent to the audit fetch server." : "The audit runs on the server and is stored only in this browser history unless you submit the report form."}</span>
              </div>
              {isRunning && auditStatus && (
                <div className="mt-4 flex items-center gap-3 rounded-2xl border border-digital-orange/20 bg-digital-orange/5 px-4 py-3 text-sm font-semibold text-abyssal-ink">
                  <Loader2 className="h-4 w-4 animate-spin text-digital-orange" />
                  <span>{auditStatus}</span>
                </div>
              )}
            </form>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                ["14-point audit", "Covers title, meta, H1, canonical, schema, social tags, mobile SEO, and content quality."],
                ["Instant SEO score", "See what passes, what fails, and which fixes can improve ranking signals fastest."],
                ["Made for Indian businesses", "Useful for founders, local businesses, agencies, and teams that need a quick SEO report."],
              ].map(([title, desc]) => (
                <div key={title} className="rounded-2xl border border-abyssal-ink/10 bg-white p-4">
                  <p className="text-sm font-bold text-abyssal-ink">{title}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-abyssal-ink/55">{desc}</p>
                </div>
              ))}
            </div>

            {error && (
              <div className="mt-4 flex min-w-0 items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <XCircle className="mt-0.5 h-4 w-4 shrink-0" /> <span className="min-w-0 break-words">{error}</span>
              </div>
            )}
          </div>
        </section>

        <section className="py-8 md:py-12" aria-label="Business lead finder">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
            <div className="overflow-hidden rounded-3xl border border-abyssal-ink/10 bg-white shadow-xl shadow-abyssal-ink/5">
              <div className="grid gap-0 lg:grid-cols-[0.85fr_1.15fr]">
                <div className="bg-abyssal-ink p-6 text-white md:p-8">
                  <span className="inline-flex items-center gap-2 rounded-full bg-digital-orange/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-digital-orange">
                    <Building2 className="h-3.5 w-3.5" /> Lead Finder
                  </span>
                  <h2 className="mt-4 font-display text-3xl font-bold leading-tight md:text-4xl">
                    Find businesses that need a website or SEO help
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-white/65 md:text-base">
                    Select a niche, city, and lead count. The finder checks the shared lead cache first, then public map data only when fresh data is needed.
                  </p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                    {[
                      ["Under 500 leads", "Keeps searches fast and usable."],
                      ["Missing website filter", "Prioritizes businesses with clear website gap."],
                      ["Shared cache", "Imported/scraped leads are reused for the next users."],
                      ["Export ready", "Download CSV or JSON for your lead workflow."],
                    ].map(([title, desc]) => (
                      <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p className="text-sm font-bold text-white">{title}</p>
                        <p className="mt-1 text-xs leading-relaxed text-white/55">{desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="min-w-0 p-5 md:p-6">
                  <form onSubmit={findLeads} className="grid min-w-0 gap-3 md:grid-cols-2">
                    <div className="min-w-0 rounded-2xl border border-abyssal-ink/10 bg-ash-white px-4 py-3">
                      <label htmlFor="lead-niche" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-abyssal-ink/40">
                        <Filter className="h-3.5 w-3.5" /> Niche
                      </label>
                      <select
                        id="lead-niche"
                        value={leadFinderNiche}
                        onChange={(e) => setLeadFinderNiche(e.target.value)}
                        disabled={leadFinderLoading}
                        className="mt-1 w-full bg-transparent text-sm font-semibold text-abyssal-ink outline-none"
                      >
                        {LEAD_NICHES.map((niche) => (
                          <option key={niche} value={niche}>{niche}</option>
                        ))}
                      </select>
                    </div>

                    <div className="min-w-0 rounded-2xl border border-abyssal-ink/10 bg-ash-white px-4 py-3">
                      <label htmlFor="lead-location" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-abyssal-ink/40">
                        <MapPin className="h-3.5 w-3.5" /> Location
                      </label>
                      <input
                        id="lead-location"
                        value={leadFinderLocation}
                        onChange={(e) => setLeadFinderLocation(e.target.value)}
                        placeholder="Indore, Pune, Mumbai"
                        disabled={leadFinderLoading}
                        className="mt-1 w-full bg-transparent text-sm font-semibold text-abyssal-ink outline-none placeholder:text-abyssal-ink/30"
                        required
                      />
                    </div>

                    <div className="min-w-0 rounded-2xl border border-abyssal-ink/10 bg-ash-white px-4 py-3">
                      <label htmlFor="lead-count" className="block text-[10px] font-bold uppercase tracking-[0.18em] text-abyssal-ink/40">Lead count</label>
                      <input
                        id="lead-count"
                        type="number"
                        min="1"
                        max="500"
                        value={leadFinderCount}
                        onChange={(e) => setLeadFinderCount(e.target.value)}
                        disabled={leadFinderLoading}
                        className="mt-1 w-full bg-transparent text-sm font-semibold text-abyssal-ink outline-none"
                      />
                    </div>

                    <div className="min-w-0 rounded-2xl border border-abyssal-ink/10 bg-ash-white px-4 py-3">
                      <label htmlFor="lead-filter" className="block text-[10px] font-bold uppercase tracking-[0.18em] text-abyssal-ink/40">Website filter</label>
                      <select
                        id="lead-filter"
                        value={leadFinderFilter}
                        onChange={(e) => setLeadFinderFilter(e.target.value as typeof leadFinderFilter)}
                        disabled={leadFinderLoading}
                        className="mt-1 w-full bg-transparent text-sm font-semibold text-abyssal-ink outline-none"
                      >
                        {LEAD_FILTERS.map((filter) => (
                          <option key={filter.value} value={filter.value}>{filter.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-2 md:col-span-2 sm:flex-row">
                      <button
                        type="submit"
                        disabled={leadFinderLoading}
                        className="flex items-center justify-center gap-2 rounded-full bg-digital-orange px-6 py-3 text-sm font-bold text-white shadow-lg shadow-digital-orange/20 hover:bg-digital-orange/95 disabled:opacity-60"
                      >
                        {leadFinderLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                        {leadFinderLoading ? "Finding Leads..." : "Find Leads"}
                      </button>
                      <button
                        type="button"
                        onClick={exportLeadCsv}
                        disabled={!leadFinderResults.length}
                        className="flex items-center justify-center gap-2 rounded-full border border-abyssal-ink/15 px-5 py-3 text-sm font-bold text-abyssal-ink hover:bg-ash-white disabled:opacity-40"
                      >
                        <Download className="h-4 w-4" /> CSV
                      </button>
                      <button
                        type="button"
                        onClick={exportLeadJson}
                        disabled={!leadFinderResults.length}
                        className="flex items-center justify-center gap-2 rounded-full border border-abyssal-ink/15 px-5 py-3 text-sm font-bold text-abyssal-ink hover:bg-ash-white disabled:opacity-40"
                      >
                        <Download className="h-4 w-4" /> JSON
                      </button>
                    </div>
                  </form>

                  {(leadFinderStatus || leadFinderError) && (
                    <div className={`mt-4 flex min-w-0 items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${leadFinderError ? "border-red-200 bg-red-50 text-red-700" : "border-digital-orange/20 bg-digital-orange/5 text-abyssal-ink"}`}>
                      {leadFinderLoading ? <Loader2 className="mt-0.5 h-4 w-4 shrink-0 animate-spin text-digital-orange" /> : leadFinderError ? <XCircle className="mt-0.5 h-4 w-4 shrink-0" /> : <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />}
                      <span className="min-w-0 break-words">{leadFinderError || leadFinderStatus}</span>
                    </div>
                  )}

                  {leadFinderSourceNote && (
                    <p className="mt-3 break-words text-xs leading-relaxed text-abyssal-ink/45">{leadFinderSourceNote}</p>
                  )}

                  <div className="mt-5 rounded-2xl border border-abyssal-ink/10 bg-ash-white p-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0">
                        <p className="flex items-center gap-2 text-sm font-bold text-abyssal-ink">
                          <MapPin className="h-4 w-4 text-digital-orange" /> Google Maps local import
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-abyssal-ink/55">
                          Free local scraper command: <span className="break-all font-mono text-abyssal-ink">npm run leads:google -- --query "{leadFinderNiche} in {leadFinderLocation}" --count {leadFinderCount} --headless</span>. Import once; future users get saved leads from cache.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={importGoogleMapsLeads}
                        disabled={!googleMapsImport.trim() || leadFinderLoading}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-abyssal-ink px-5 text-sm font-bold text-white hover:bg-abyssal-ink/90 disabled:opacity-40"
                      >
                        <Search className="h-4 w-4" /> Import Leads
                      </button>
                    </div>
                    <textarea
                      value={googleMapsImport}
                      onChange={(e) => setGoogleMapsImport(e.target.value)}
                      disabled={leadFinderLoading}
                      placeholder="Paste .leads.json output from the local scraper, or copied Google Maps listing text..."
                      className="mt-3 min-h-28 w-full resize-y rounded-xl border border-abyssal-ink/10 bg-white px-4 py-3 font-mono text-xs leading-relaxed text-abyssal-ink outline-none focus:border-digital-orange/60"
                    />
                  </div>

                  {leadFinderResults.length > 0 && (
                    <div className="mt-5 overflow-hidden rounded-2xl border border-abyssal-ink/10">
                      <div className="bg-ash-white px-4 py-3">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <p className="text-sm font-bold text-abyssal-ink">{leadFinderResults.length} leads found</p>
                          <p className="text-xs text-abyssal-ink/45">Sorted by lead score and website gap</p>
                        </div>
                        <div className="mt-3 grid gap-2 sm:grid-cols-4">
                          {[
                            ["No website", leadFinderSummary.noWebsite],
                            ["Social-only", leadFinderSummary.socialOnly],
                            ["Contact-ready", leadFinderSummary.contactReady],
                            ["Priority A", leadFinderSummary.priorityA],
                          ].map(([label, value]) => (
                            <div key={String(label)} className="rounded-xl border border-abyssal-ink/10 bg-white px-3 py-2">
                              <p className="font-display text-xl font-bold text-abyssal-ink">{value}</p>
                              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-abyssal-ink/40">{label}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="grid max-h-[520px] gap-3 overflow-auto p-3 md:hidden">
                        {leadFinderResults.map((lead) => (
                          <article key={lead.id} className="min-w-0 rounded-2xl border border-abyssal-ink/10 bg-white p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="break-words font-bold text-abyssal-ink">{lead.businessName}</p>
                                <p className="mt-1 break-words text-xs capitalize text-abyssal-ink/45">{lead.category || lead.niche}</p>
                              </div>
                              <div className="shrink-0 text-right">
                                <p className="font-display text-2xl font-bold text-abyssal-ink">{lead.leadScore}</p>
                                <p className="text-[10px] font-bold text-digital-orange">P{lead.priority}</p>
                              </div>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2">
                              <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${lead.websiteStatus === "missing" ? "bg-red-50 text-red-700" : lead.websiteStatus === "social-only" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>
                                {lead.websiteStatus === "missing" ? "No website" : lead.websiteStatus === "social-only" ? "Social-only" : "Website listed"}
                              </span>
                              {lead.source && <span className="rounded-full bg-ash-white px-2.5 py-1 text-xs font-semibold text-abyssal-ink/55">{lead.source}</span>}
                            </div>
                            <div className="mt-3 space-y-1.5 text-xs leading-relaxed text-abyssal-ink/60">
                              {lead.phone ? <p className="flex min-w-0 items-center gap-1.5 break-words"><Phone className="h-3.5 w-3.5 shrink-0" /> {lead.phone}</p> : <p className="text-abyssal-ink/35">No phone</p>}
                              {lead.email && <p className="flex min-w-0 items-center gap-1.5 break-all"><Mail className="h-3.5 w-3.5 shrink-0" /> {lead.email}</p>}
                              <p className="break-words">{lead.address || lead.location}</p>
                              {lead.reason && <p className="break-words text-abyssal-ink/40">{lead.reason}</p>}
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {lead.website && (
                                <a href={lead.website.startsWith("http") ? lead.website : `https://${lead.website}`} target="_blank" rel="noreferrer" className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-digital-orange/25 px-3 text-xs font-bold text-digital-orange">
                                  <Globe2 className="h-3.5 w-3.5" /> Website
                                </a>
                              )}
                              {lead.sourceUrl && (
                                <a href={lead.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-abyssal-ink/15 px-3 text-xs font-bold text-abyssal-ink">
                                  Source <ExternalLink className="h-3.5 w-3.5" />
                                </a>
                              )}
                            </div>
                          </article>
                        ))}
                      </div>
                      <div className="hidden max-h-[520px] overflow-auto md:block">
                        <table className="min-w-[980px] w-full text-left text-sm">
                          <thead className="sticky top-0 bg-white text-[10px] uppercase tracking-[0.14em] text-abyssal-ink/40">
                            <tr>
                              <th className="px-4 py-3">Business</th>
                              <th className="px-4 py-3">Gap</th>
                              <th className="px-4 py-3">Contact</th>
                              <th className="px-4 py-3">Address</th>
                              <th className="px-4 py-3">Score</th>
                              <th className="px-4 py-3">Source</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-abyssal-ink/10">
                            {leadFinderResults.map((lead) => (
                              <tr key={lead.id} className="align-top">
                                <td className="px-4 py-3">
                                  <p className="max-w-[220px] break-words font-bold text-abyssal-ink">{lead.businessName}</p>
                                  <p className="mt-1 max-w-[220px] break-words text-xs capitalize text-abyssal-ink/45">{lead.category || lead.niche}</p>
                                </td>
                                <td className="px-4 py-3">
                                  <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${lead.websiteStatus === "missing" ? "bg-red-50 text-red-700" : lead.websiteStatus === "social-only" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>
                                    {lead.websiteStatus === "missing" ? "No website" : lead.websiteStatus === "social-only" ? "Social-only" : "Website listed"}
                                  </span>
                                  {lead.website && (
                                    <a href={lead.website.startsWith("http") ? lead.website : `https://${lead.website}`} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs text-digital-orange">
                                      <Globe2 className="h-3.5 w-3.5" /> Open website
                                    </a>
                                  )}
                                </td>
                                <td className="px-4 py-3">
                                  {lead.phone ? <p className="flex max-w-[180px] items-center gap-1.5 break-words text-xs text-abyssal-ink/65"><Phone className="h-3.5 w-3.5 shrink-0" /> {lead.phone}</p> : <p className="text-xs text-abyssal-ink/35">No phone</p>}
                                  {lead.email && <p className="mt-1 flex max-w-[180px] items-center gap-1.5 break-all text-xs text-abyssal-ink/65"><Mail className="h-3.5 w-3.5 shrink-0" /> {lead.email}</p>}
                                </td>
                                <td className="px-4 py-3">
                                  <p className="max-w-xs break-words text-xs leading-relaxed text-abyssal-ink/55">{lead.address || lead.location}</p>
                                  <p className="mt-1 max-w-xs break-words text-xs text-abyssal-ink/35">{lead.reason}</p>
                                </td>
                                <td className="px-4 py-3">
                                  <p className="font-display text-2xl font-bold text-abyssal-ink">{lead.leadScore}</p>
                                  <p className="text-xs font-bold text-digital-orange">Priority {lead.priority}</p>
                                </td>
                                <td className="px-4 py-3">
                                  {lead.sourceUrl ? (
                                    <a href={lead.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-abyssal-ink hover:text-digital-orange">
                                      {lead.source} <ExternalLink className="h-3.5 w-3.5" />
                                    </a>
                                  ) : (
                                    <span className="text-xs text-abyssal-ink/45">{lead.source}</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 md:py-12">
          <div className="mx-auto grid max-w-[1200px] gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_0.85fr]">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-2 rounded-full bg-abyssal-ink/5 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-abyssal-ink/55">
                On-page SEO checker
              </span>
              <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-abyssal-ink md:text-4xl">
                Check the SEO issues that usually stop a website from ranking
              </h2>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-abyssal-ink/65 md:text-base">
                <p>
                  This free website SEO checker helps you review the first layer of ranking signals before you spend money on ads, content, or a full SEO campaign. It checks whether your page has a strong title tag, useful meta description, clear H1, self-referencing canonical URL, structured data, social preview tags, mobile viewport, image alt text, and enough crawlable content.
                </p>
                <p>
                  The tool is built for small businesses, startups, creators, and agencies that need a fast SEO audit report. Use it to find quick wins, explain SEO problems to clients, or prepare a fix list for your developer.
                </p>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {["free SEO audit tool", "website SEO checker", "on-page SEO checker", "SEO score checker", "technical SEO audit"].map((keyword) => (
                  <span key={keyword} className="rounded-full border border-digital-orange/20 bg-digital-orange/5 px-3 py-1.5 text-xs font-semibold text-digital-orange">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            <div className="min-w-0 rounded-3xl border border-abyssal-ink/10 bg-white p-5 shadow-xl shadow-abyssal-ink/5">
              <h2 className="font-display text-2xl font-bold text-abyssal-ink">What the free SEO audit checks</h2>
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {SEO_CHECKS.map((check) => (
                  <div key={check} className="flex items-start gap-2 rounded-xl bg-ash-white p-3 text-sm text-abyssal-ink/70">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span>{check}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 md:py-12">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
            <div className="rounded-3xl bg-abyssal-ink p-6 text-white md:p-8">
              <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="min-w-0">
                  <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-digital-orange">How it helps ranking</span>
                  <h2 className="mt-3 font-display text-3xl font-bold leading-tight md:text-4xl">
                    Turn a quick SEO score into a practical ranking plan
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-white/65 md:text-base">
                    A single SEO score is only useful when it turns into action. This audit groups failed checks into priority fixes, explains the business impact, and helps you decide whether the page needs metadata cleanup, schema markup, better headings, stronger copy, or a deeper technical review.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <a href="/services/web-development" className="rounded-full bg-digital-orange px-5 py-3 text-sm font-bold text-white">
                      Fix My Website SEO
                    </a>
                    <a href="/contact" className="rounded-full border border-white/20 px-5 py-3 text-sm font-bold text-white">
                      Talk to an SEO Expert
                    </a>
                  </div>
                </div>
                <div className="grid min-w-0 gap-3 sm:grid-cols-3">
                  {SEO_AUDIT_HOW_TO_STEPS.map((step, index) => (
                    <div key={step.name} className="min-w-0 rounded-2xl bg-white/5 p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-digital-orange">Step {index + 1}</p>
                      <h3 className="mt-2 text-base font-bold text-white">{step.name}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/65">{step.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {result && (
          <section className="py-6">
            <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
              <div className="grid min-w-0 gap-6 lg:grid-cols-3">
                <div className="min-w-0 rounded-3xl border border-abyssal-ink/10 bg-white p-6 lg:col-span-1">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-abyssal-ink/40">Growth Index</p>
                      <p className="font-display text-6xl font-bold text-abyssal-ink">
                        {result.score}<span className="text-2xl text-abyssal-ink/30">/100</span>
                      </p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${scoreScore(result.score).text}`}>{scoreScore(result.score).label}</span>
                  </div>
                  <p className="mt-3 break-all text-sm text-abyssal-ink/55">{result.passed}/{result.total} checks passing · {result.url}</p>

                  <div className="mt-5 space-y-2">
                    <button onClick={exportCsv} className="flex w-full items-center justify-center gap-2 rounded-xl border border-abyssal-ink/15 px-4 py-2.5 text-sm font-semibold text-abyssal-ink hover:bg-ash-white">
                      <Download className="h-4 w-4" /> Export CSV
                    </button>
                    <button onClick={exportJson} className="flex w-full items-center justify-center gap-2 rounded-xl border border-abyssal-ink/15 px-4 py-2.5 text-sm font-semibold text-abyssal-ink hover:bg-ash-white">
                      <Download className="h-4 w-4" /> Export JSON
                    </button>
                    <button onClick={openPrintReport} className="flex w-full items-center justify-center gap-2 rounded-xl bg-abyssal-ink px-4 py-2.5 text-sm font-semibold text-white hover:bg-abyssal-ink/90">
                      <FileText className="h-4 w-4" /> PDF Report
                    </button>
                  </div>

                  <div className="mt-5 rounded-2xl bg-ash-white p-4">
                    <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-abyssal-ink/40">
                      <TrendingUp className="h-3.5 w-3.5" /> Revenue Leak Estimate
                    </p>
                    {leak && (
                      <p className="mt-1 font-display text-2xl font-bold text-abyssal-ink">
                        ₹{leak.perYearInr.toLocaleString("en-IN")}
                        <span className="text-sm font-normal text-abyssal-ink/45">/year at risk</span>
                      </p>
                    )}
                    <p className="mt-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-abyssal-ink/40">
                      <Star className="h-3.5 w-3.5" /> 30/60/90 Roadmap
                    </p>
                    {Object.entries(roadmap).map(([phase, items]) => (
                      <div key={phase} className="mt-2">
                        <p className="text-xs font-semibold text-abyssal-ink/60">
                          {phase} — {items.length} fix(es)
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid min-w-0 gap-3 lg:col-span-2 sm:grid-cols-2">
                  {result.checks.map((c) => (
                    <div key={c.id} className="min-w-0 rounded-2xl border border-abyssal-ink/10 bg-white p-4">
                      <div className="flex items-start gap-2.5">
                        {c.passed ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" /> : <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />}
                        <div className="min-w-0">
                          <p className="break-words text-sm font-bold text-abyssal-ink">{c.label}</p>
                          <p className="mt-0.5 break-words text-xs text-abyssal-ink/55">{c.detail}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {leadStatus === "sent" ? (
                <div className="mt-8 rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-center">
                  <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500" />
                  <h3 className="mt-2 font-display text-xl font-bold text-abyssal-ink">Report sent to your email.</h3>
                  <p className="mt-1 text-sm text-abyssal-ink/60">Our team will review the audit and contact you on WhatsApp or email with the best fixes and quote.</p>
                </div>
              ) : (
                <form onSubmit={submitAuditLead} className="mt-8 rounded-3xl border border-digital-orange/25 bg-white p-6 shadow-xl shadow-digital-orange/5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-digital-orange">Free Expert Review</p>
                      <h3 className="mt-1 font-display text-xl font-bold text-abyssal-ink">Get your report and fix list by email</h3>
                      <p className="mt-1 text-sm text-abyssal-ink/55">MistHustlers SEO experts will send you a detailed breakdown for <span className="break-all">{result.url}</span> with starter fixes. Free, no spam.</p>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <input
                        type="text"
                        value={leadName}
                        onChange={(e) => setLeadName(e.target.value)}
                        placeholder="Your name"
                        className="w-full sm:w-44 rounded-xl border border-abyssal-ink/15 bg-white px-4 py-3 text-sm text-abyssal-ink outline-none focus:border-digital-orange/60"
                      />
                      <input
                        type="email"
                        required
                        value={leadEmail}
                        onChange={(e) => setLeadEmail(e.target.value)}
                        placeholder="Email"
                        className="w-full sm:w-56 rounded-xl border border-abyssal-ink/15 bg-white px-4 py-3 text-sm text-abyssal-ink outline-none focus:border-digital-orange/60"
                      />
                      <button
                        type="submit"
                        disabled={leadStatus === "sending"}
                        className="rounded-xl bg-digital-orange px-6 py-3 text-sm font-bold text-white shadow-lg transition-transform hover:scale-[1.02] disabled:opacity-60"
                      >
                        {leadStatus === "sending" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Get My Report"}
                      </button>
                    </div>
                  </div>
                  {leadStatus === "error" && (
                    <p className="mt-3 text-xs text-red-600">Email submission failed. Please try again and check your network.</p>
                  )}
                </form>
              )}

              <div className="mt-8 rounded-3xl bg-abyssal-ink p-6 text-white">
                <h2 className="font-display text-2xl font-bold">Priority Fixes</h2>
                {insights.length ? (
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {insights.map((i) => (
                      <div key={i.id} className="min-w-0 rounded-2xl bg-white/5 p-4">
                        <p className="break-words text-sm font-bold text-digital-orange">→ {i.issue}</p>
                        <p className="mt-1.5 break-words text-sm leading-relaxed text-white/75">{i.fix}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-white/60">No high-priority issues found. The site is strong.</p>
                )}
              </div>

              {businessSummaryMemo && (
                <div className="mt-8 overflow-hidden rounded-3xl border border-digital-orange/25 bg-white shadow-xl shadow-digital-orange/5">
                  <div className="bg-abyssal-ink p-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-digital-orange">Business Summary</p>
                    <h2 className="mt-1 font-display text-2xl font-bold text-white">{businessSummaryMemo.headline}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-white/70">{businessSummaryMemo.intro}</p>
                  </div>

                  <div className="divide-y divide-abyssal-ink/10 px-6">
                    {businessSummaryMemo.items.map((item) => (
                      <div key={item.id} className="min-w-0 py-4">
                        <p className="break-words text-sm font-bold text-abyssal-ink">• {item.heading}</p>
                        <p className="mt-1 break-words text-sm leading-relaxed text-abyssal-ink/70">{item.detail}</p>
                      </div>
                    ))}
                  </div>

                  {businessSummaryMemo.plan.length > 0 && (
                    <div className="border-t border-abyssal-ink/10 bg-ash-white px-6 py-5">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-abyssal-ink/40">Your action plan</p>
                      <div className="mt-3 grid gap-4 md:grid-cols-3">
                        {businessSummaryMemo.plan.map((phase) => (
                          <div key={phase.label} className="min-w-0">
                            <p className="text-xs font-bold uppercase tracking-[0.12em] text-digital-orange">{phase.label}</p>
                            <ul className="mt-2 space-y-1.5 text-sm text-abyssal-ink/75">
                              {phase.action.map((s) => (
                                <li key={s.id} className="flex items-start gap-1.5">
                                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-digital-orange" />
                                  <span className="min-w-0 break-words">{s.issue}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                      <p className="mt-4 text-[11px] text-abyssal-ink/40">Scores and estimates are generic. Confirm final ranking decisions with a MistHustlers SEO expert.</p>
                    </div>
                  )}
                </div>
              )}

              {(
                <div className="mt-8 overflow-hidden rounded-3xl border border-cyber-violet/25 bg-white shadow-xl shadow-cyber-violet/5">
                  <div className="flex items-center justify-between gap-3 p-6">
                    <div>
                      <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyber-violet">
                        <Target className="h-3.5 w-3.5" /> CRO — Conversion Tips
                      </p>
                      <h2 className="mt-1 font-display text-2xl font-bold text-abyssal-ink">Turn traffic into leads</h2>
                    </div>
                  </div>
                  {croTips.length ? (
                    <div className="grid gap-4 px-6 pb-6 sm:grid-cols-2">
                      {croTips.map((t) => (
                        <div key={t.id} className="min-w-0 rounded-2xl bg-ash-white p-4">
                          <p className="break-words text-sm font-bold text-abyssal-ink">→ {t.title}</p>
                          <p className="mt-1 break-words text-sm leading-relaxed text-abyssal-ink/70">{t.detail}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="px-6 pb-6 text-sm text-abyssal-ink/60">No high-priority conversion red flags found. Continue A/B testing CTAs, forms, and trust badges.</p>
                  )}
                </div>
              )}

              {(
                <div className="mt-8 overflow-hidden rounded-3xl border border-digital-orange/25 bg-white shadow-xl shadow-digital-orange/5">
                  <div className="flex items-center justify-between gap-3 p-6">
                    <div>
                      <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-digital-orange">
                        <Compass className="h-3.5 w-3.5" /> Competitor IQ
                      </p>
                      <h2 className="mt-1 font-display text-2xl font-bold text-abyssal-ink">Benchmark your competitors in a 3-way comparison</h2>
                    </div>
                  </div>
                  <div className="px-6 pb-6">
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <input
                          value={competitorUrl}
                          onChange={(e) => setCompetitorUrl(e.target.value)}
                          placeholder="Competitor 1 URL"
                          className="flex-1 rounded-xl border border-abyssal-ink/15 bg-white px-4 py-3 text-sm text-abyssal-ink outline-none focus:border-digital-orange/60"
                        />
                        <button onClick={() => compareCompetitor(1)} disabled={isComparing} className="flex items-center justify-center gap-2 rounded-xl bg-abyssal-ink px-5 py-3 text-sm font-bold text-white hover:bg-abyssal-ink/90 disabled:opacity-60">
                          {isComparing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                        </button>
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <input
                          value={competitorUrl2}
                          onChange={(e) => setCompetitorUrl2(e.target.value)}
                          placeholder="Competitor 2 URL (optional)"
                          className="flex-1 rounded-xl border border-abyssal-ink/15 bg-white px-4 py-3 text-sm text-abyssal-ink outline-none focus:border-digital-orange/60"
                        />
                        <button onClick={() => compareCompetitor(2)} disabled={isComparing} className="flex items-center justify-center gap-2 rounded-xl bg-abyssal-ink px-5 py-3 text-sm font-bold text-white hover:bg-abyssal-ink/90 disabled:opacity-60">
                          {isComparing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    {competitorError && <p className="mt-2 break-words text-xs text-red-600">{competitorError}</p>}
                    {(() => {
                      if (!result) return null;
                      const have1 = competitorResult && competitorResult.url !== result.url;
                      const have2 = competitorResult2 && competitorResult2.url !== result.url;
                      if (!have1 && !have2) return null;
                      return <CompMatrix result={result} cmp1={have1 ? competitorResult : null} cmp2={have2 ? competitorResult2 : null} />;
                    })()}
                  </div>
                </div>
              )}

              {(
                <div className="mt-8 overflow-hidden rounded-3xl border border-emerald-600/25 bg-white shadow-xl shadow-emerald-600/5">
                  <div className="flex items-center justify-between gap-3 p-6">
                    <div>
                      <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-600">
                        <CalculatorIcon className="h-3.5 w-3.5" /> Cost Calculator
                      </p>
                      <h2 className="mt-1 font-display text-2xl font-bold text-abyssal-ink">Get a website or SEO project estimate</h2>
                    </div>
                  </div>
                  <div className="px-6 pb-6">
                    <div className="flex flex-wrap gap-2">
                      {(["landing", "business", "corporate"] as const).map((p) => (
                        <button
                          key={p}
                          onClick={() => setCostInput((s) => ({ ...s, pages: p }))}
                          className={`rounded-full px-4 py-2 text-sm font-bold capitalize ${costInput.pages === p ? "bg-emerald-600 text-white" : "bg-ash-white text-abyssal-ink/60"}`}
                        >
                          {p === "landing" ? "1-page Landing" : p === "business" ? "Business (5+ pages)" : "Corporate (10+ pages)"}
                        </button>
                      ))}
                    </div>
                    <div className="mt-4 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                      {Object.entries(COST_EXTRAS).map(([key, label]) => (
                        <ToggleExtras key={key} label={label} checked={costInput.extras.includes(key)} onClick={() => toggleCostExtra(key)} />
                      ))}
                    </div>
                    {costEstimate && (
                      <div className="mt-5 rounded-2xl bg-ash-white p-4">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <p className="text-sm text-abyssal-ink/60">Estimated one-time cost</p>
                          <p className="font-display text-3xl font-bold text-abyssal-ink">{costEstimate.totalLabel}</p>
                        </div>
                        <p className="mt-1 text-xs text-abyssal-ink/45">
                          Base ₹{costEstimate.baseCost.toLocaleString("en-IN")} + {costEstimate.addons.length} add-ons
                        </p>
                        {invoice && (
                          <div className="mt-3 border-t border-abyssal-ink/10 pt-3 text-xs text-abyssal-ink/60">
                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                              <span>Base (excl. GST)</span><span>₹{invoice.base.toLocaleString("en-IN")}</span>
                            </div>
                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                              <span>GST @ {invoice.gstRate}%</span><span>₹{invoice.gstAmount.toLocaleString("en-IN")}</span>
                            </div>
                            <div className="flex flex-wrap items-baseline justify-between gap-2 font-bold text-abyssal-ink">
                              <span>Invoice total</span><span>₹{invoice.total.toLocaleString("en-IN")}</span>
                            </div>
                          </div>
                        )}
                        {roi && (
                          <div className="mt-3 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800">
                            <p className="font-bold">ROI outlook</p>
                            <p className="mt-1">{roi.message}</p>
                            <p className="mt-1">Annual recoverable risk estimate basis: ₹{roi.annualRecoverable.toLocaleString("en-IN")}/yr.</p>
                          </div>
                        )}
                        <p className="mt-3 text-[11px] text-abyssal-ink/40">Indicative estimate. For a final quote, visit the Pricing page or contact us on WhatsApp. GST invoicing is ready.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {(
                <div className="mt-8 overflow-hidden rounded-3xl border border-cyber-violet/25 bg-white shadow-xl shadow-cyber-violet/5">
                  <div className="flex flex-wrap items-center justify-between gap-3 p-6">
                    <div>
                      <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyber-violet">
                        <Gauge className="h-3.5 w-3.5" /> Tracked Sites — {trackedSites.length}/{MAX_TRACKED}
                      </p>
                      <h2 className="mt-1 font-display text-2xl font-bold text-abyssal-ink">Monitor 3 sites in one place</h2>
                    </div>
                    <button
                      onClick={() => window.open(`https://wa.me/918889937648?text=${encodeURIComponent("Hi MistHustlers, I want help with the tracked-sites SEO audit feature.")}`, "_blank")}
                      className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white"
                    >
                      WhatsApp Support
                    </button>
                  </div>

                  <form onSubmit={addTrackedSite} className="flex flex-col gap-2 px-6 pb-2 sm:flex-row">
                    <input
                      value={trackedUrl}
                      onChange={(e) => setTrackedUrl(e.target.value)}
                      placeholder="https://another-site.com"
                      disabled={trackingIndex !== null}
                      className="flex-1 rounded-xl border border-abyssal-ink/15 bg-white px-4 py-3 font-mono text-sm text-abyssal-ink outline-none focus:border-cyber-violet/60 disabled:opacity-60"
                    />
                    <button
                      type="submit"
                      disabled={trackingIndex !== null || trackedSites.length >= MAX_TRACKED}
                      className="flex items-center justify-center gap-2 rounded-xl bg-cyber-violet px-5 py-3 text-sm font-bold text-white hover:bg-cyber-violet/90 disabled:opacity-60"
                    >
                      {trackingIndex === trackedSites.length ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                      Track Site
                    </button>
                  </form>
                  {trackedError && <p className="break-words px-6 pb-2 text-xs text-red-600">{trackedError}</p>}

                  {trackedSites.length ? (
                    <div className="grid gap-3 px-6 pb-6 sm:grid-cols-2">
                      {trackedSites.map((site, i) => (
                        <div key={`${site.url}-${i}`} className="rounded-2xl bg-ash-white p-4">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="break-all font-mono text-xs text-abyssal-ink/55">{site.url}</p>
                              <p className="mt-1 font-display text-2xl font-bold text-abyssal-ink">
                                {site.score !== null ? (
                                  <>
                                    {site.score}<span className="text-sm font-normal text-abyssal-ink/45">/100</span>
                                  </>
                                ) : "—"}
                              </p>
                              <p className="text-[11px] text-abyssal-ink/50">
                                {site.updatedAt ? `Last audit: ${new Date(site.updatedAt).toLocaleString("en-IN")}` : "Audit pending"}
                              </p>
                            </div>
                            <div className="flex flex-col gap-2">
                              <button
                                onClick={() => reAuditTracked(i)}
                                disabled={trackingIndex !== null}
                                className="flex items-center gap-1.5 rounded-lg bg-abyssal-ink px-3 py-1.5 text-xs font-bold text-white hover:bg-abyssal-ink/90 disabled:opacity-60"
                              >
                                {trackingIndex === i ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Zap className="h-3.5 w-3.5" />}
                                Re-audit
                              </button>
                              <button
                                onClick={() => removeTracked(i)}
                                disabled={trackingIndex !== null}
                                className="flex items-center gap-1.5 rounded-lg border border-abyssal-ink/15 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 disabled:opacity-60"
                              >
                                <Trash2 className="h-3.5 w-3.5" /> Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="px-6 pb-6 text-sm text-abyssal-ink/55">
                      Enter a URL above. Scores for up to 3 sites stay tracked here in this browser.
                    </p>
                  )}
                </div>
              )}

              {srs && (
                <div className="mt-8 overflow-hidden rounded-3xl border border-abyssal-ink/10 bg-white shadow-xl">
                  <div className="flex flex-wrap items-center justify-between gap-3 p-6">
                    <div>
                      <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-abyssal-ink/50">
                        <FileCheck2 className="h-3.5 w-3.5" /> SRS — SEO & Requirements Spec
                      </p>
                      <h2 className="mt-1 font-display text-2xl font-bold text-abyssal-ink">Requirement document and enterprise blueprint for your dev team</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => downloadText(`srs-${siteName || "project"}.txt`, srsToText(srs), "text/plain")} className="flex items-center gap-2 rounded-xl border border-abyssal-ink/15 px-4 py-2.5 text-sm font-semibold text-abyssal-ink hover:bg-ash-white">
                        <Download className="h-4 w-4" /> SRS .txt
                      </button>
                      {srsBlueprint && (
                        <button onClick={() => downloadText(`blueprint-${siteName || "project"}.md`, srsBlueprintMd(srsBlueprint), "text/markdown")} className="flex items-center gap-2 rounded-xl bg-abyssal-ink px-4 py-2.5 text-sm font-semibold text-white hover:bg-abyssal-ink/90">
                          <Download className="h-4 w-4" /> Blueprint .md
                        </button>
                      )}
                    </div>
                  </div>

                  {srsBlueprint && (
                    <div className="border-t border-abyssal-ink/10 bg-ash-white px-6 py-5">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-abyssal-ink/40">Enterprise Blueprint — {srsBlueprint.version}</p>
                      <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {srsBlueprint.stack.map((s) => (
                          <div key={s.framework} className="min-w-0 rounded-xl bg-white p-3 text-sm">
                            <p className="break-words text-xs font-bold text-abyssal-ink/60">{s.framework}</p>
                            <p className="mt-1 break-words font-semibold text-abyssal-ink">{s.recommended}</p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        {srsBlueprint.sprints.map((sp) => (
                          <div key={sp.phase} className="min-w-0 rounded-xl bg-white p-4 text-sm">
                            <p className="text-xs font-bold text-digital-orange uppercase tracking-[0.12em]">{sp.phase} — {sp.duration}</p>
                            <ul className="mt-2 space-y-1 text-abyssal-ink/75">
                              {sp.scope.map((s) => <li key={s} className="flex items-start gap-1.5"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-digital-orange" />{s}</li>)}
                            </ul>
                          </div>
                        ))}
                      </div>
                      <p className="mt-4 text-xs text-abyssal-ink/50">
                        Estimated effort: {srsBlueprint.totalHours}h across ~{srsBlueprint.estimatedWeeks} weeks · {srsBlueprint.team.length} team roles.
                      </p>
                    </div>
                  )}
                  <div className="grid gap-4 px-6 pb-6 md:grid-cols-2">
                    {srs.sections.map((section) => (
                      <div key={section.group} className="rounded-2xl bg-ash-white p-4">
                        <p className="text-sm font-bold text-abyssal-ink">{section.title}</p>
                        <ul className="mt-2 space-y-1.5 text-sm text-abyssal-ink/75">
                          {section.requirements.map((r) => (
                            <li key={r.code} className="flex min-w-0 items-start gap-1.5">
                              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-digital-orange" />
                              <span className="min-w-0 break-words"><span className="font-mono text-[10px] text-abyssal-ink/40">{r.code}</span> {r.title} <span className="text-[10px] text-abyssal-ink/40">({r.effort})</span></span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    {srs.sections.length === 0 && <p className="col-span-full text-sm text-abyssal-ink/60">All requirements pass. No changes are needed.</p>}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {history.length > 0 && (
          <section className="py-6">
            <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl font-bold text-abyssal-ink">Audit History (saved in browser)</h2>
                <button
                  onClick={() => saveHistory([])}
                  className="text-xs font-bold text-abyssal-ink/50 hover:text-red-600"
                >
                  Clear history
                </button>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                {visibleHistory.map((r) => (
                  <button
                    key={r.createdAt + r.url}
                    onClick={() => setResult(r)}
                    className="rounded-2xl border border-abyssal-ink/10 bg-white p-4 text-left hover:border-digital-orange/40"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-2xl font-bold text-abyssal-ink">{r.score}</span>
                      <span className="text-[10px] uppercase tracking-wider text-abyssal-ink/40">{r.passed}/{r.total}</span>
                    </div>
                    <p className="mt-2 truncate font-mono text-xs text-abyssal-ink/60">{r.url}</p>
                    <p className="mt-1 text-[10px] text-abyssal-ink/40">{new Date(r.createdAt).toLocaleDateString("en-IN")}</p>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        <section id="seo-audit-faq" aria-label="SEO checker frequently asked questions">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6 pb-16">
            <div className="mb-8">
              <span className="inline-flex items-center gap-2 rounded-full bg-digital-orange/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-digital-orange">
                FAQ
              </span>
              <h2 className="mt-3 font-display text-2xl font-bold sm:text-3xl text-abyssal-ink">
                Free Website SEO Checker — Frequently Asked Questions
              </h2>
            </div>
            <div className="rounded-3xl border border-abyssal-ink/10 bg-white px-6 sm:px-8">
              {SEO_AUDIT_FAQS.map((faq, i) => (
                <FAQItem key={i} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        </section>
      </main>

      {auditScreenOpen && (
        <AuditLoadingScreen
          status={auditStatus}
          target={auditTarget}
          error={error}
          running={isRunning}
          onClose={closeAuditScreen}
        />
      )}
    </>
  );
}

function csvCell(value: unknown) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function leadsToCsv(leads: LeadFinderResult[]) {
  const headers: (keyof LeadFinderResult)[] = [
    "businessName",
    "niche",
    "location",
    "category",
    "address",
    "phone",
    "email",
    "website",
    "websiteStatus",
    "leadScore",
    "priority",
    "reason",
    "source",
    "sourceUrl",
  ];
  return [headers.join(","), ...leads.map((lead) => headers.map((key) => csvCell(lead[key])).join(","))].join("\n");
}
