export type AuditCheck = {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
  weight: number;
  group: "technical" | "content" | "social" | "structure";
};

export type AuditResult = {
  url: string;
  score: number;
  passed: number;
  total: number;
  checks: AuditCheck[];
  createdAt: string;
  trafficHint: string;
};

function extract(re: RegExp, html: string) {
  const m = html.match(re);
  return m ? m[1].trim() : null;
}

function getAttr(tag: string, name: string) {
  const re = new RegExp(`${name}\\s*=\\s*["']([^"']*)["']`, "i");
  return tag.match(re)?.[1]?.trim() || null;
}

function metaContent(html: string, attr: "name" | "property", value: string) {
  const tags = html.match(/<meta\b[^>]*>/gi) || [];
  for (const tag of tags) {
    if ((getAttr(tag, attr) || "").toLowerCase() === value.toLowerCase()) {
      return getAttr(tag, "content");
    }
  }
  return null;
}

function resolveUrlMaybe(value: string, base: string) {
  try {
    return stripTrailingSlash(new URL(value, base).toString());
  } catch {
    return stripTrailingSlash(value);
  }
}

function stripTrailingSlash(value: string) {
  const s = String(value || "");
  return s.length > 1 && s.endsWith("/") ? s.slice(0, -1) : s;
}

function textContent(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeUrl(input: string) {
  let value = String(input || "").trim();
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("//")) return `https:${value}`;
  return `https://${value}`;
}

type AuditProgress = (message: string) => void;

function wait(ms: number) {
  return new Promise((resolve) => globalThis.setTimeout(resolve, ms));
}

function authHeaders(accessToken?: string) {
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
}

async function fetchViaServer(url: string, accessToken?: string) {
  const res = await fetch("/api/fetch-audit-html", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders(accessToken) },
    body: JSON.stringify({ url }),
    signal: AbortSignal.timeout(35000),
  });
  const data = await readJsonResponse(res);
  if (res.status === 401) {
    throw new Error("Sign in with Google before running an SEO audit.");
  }
  if (!res.ok || !data?.ok || typeof data.html !== "string") {
    throw new Error(data?.error || `Server audit fetch failed (${res.status})`);
  }
  if (data.html.length < 120) throw new Error("Site returned an empty page.");
  return data.html;
}

async function readJsonResponse(res: Response) {
  const text = await res.text().catch(() => "");
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Server returned a non-JSON response (${res.status}). Check Netlify redirects and function deployment.`);
  }
}

export async function fetchAuditHtml(targetUrl: string, onProgress?: AuditProgress, accessToken?: string) {
  const url = normalizeUrl(targetUrl);
  if (!url) throw new Error("Enter a valid URL first.");

  try {
    onProgress?.("Fetching and rendering website through audit server...");
    return await fetchViaServer(url, accessToken);
  } catch (err) {
    const detail = err instanceof Error ? err.message : "unknown error";
    throw new Error(
      `Could not audit this URL automatically. Make sure the latest Netlify deployment is live and the website allows public bot/browser requests. (${detail})`
    );
  }
}

export async function runAudit(rawUrl: string, trafficHint: string, onProgress?: AuditProgress, accessToken?: string): Promise<AuditResult> {
  const url = normalizeUrl(rawUrl);
  if (!url) throw new Error("Enter a valid URL first.");
  if (typeof window !== "undefined" && window.__OVERRIDE_AUDIT_HTML__?.trim()) {
    onProgress?.("Running SEO checks on pasted HTML...");
    return scoreHtml(url, window.__OVERRIDE_AUDIT_HTML__, trafficHint);
  }
  onProgress?.("Sending website to backend SEO audit engine...");
  try {
    for (let attempt = 0; attempt < 8; attempt += 1) {
      const res = await fetch("/api/run-seo-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders(accessToken) },
        body: JSON.stringify({ url, trafficHint }),
        signal: AbortSignal.timeout(45000),
      });
      const data = await readJsonResponse(res);
      if (res.status === 401) {
        throw new Error(data?.error || "Sign in with Google before running an SEO audit.");
      }
      if (data?.queued) {
        const retryAfter = Math.max(5, Math.min(Number(data.retryAfterSeconds) || 15, 120));
        onProgress?.(`Server busy. Queue position ${data.position || attempt + 1}. Retrying in ${retryAfter}s...`);
        await wait(retryAfter * 1000);
        continue;
      }
      if (!res.ok || !data?.ok || !data.result) {
        throw new Error(data?.error || `Backend audit failed (${res.status})`);
      }
      onProgress?.("Backend audit complete. Building report...");
      return data.result as AuditResult;
    }
    throw new Error("Audit queue is busy. Please try again in a few minutes.");
  } catch (err) {
    const detail = err instanceof Error ? err.message : "unknown error";
    if (/sign in|unauthorized|session expired/i.test(detail)) {
      throw err;
    }
    onProgress?.("Backend unavailable. Trying local scoring fallback...");
    const html = await fetchAuditHtml(url, onProgress, accessToken);
    onProgress?.(`Running fallback SEO checks and scoring the page... (${detail})`);
    return scoreHtml(url, html, trafficHint);
  }
}

export function scoreHtml(rawUrl: string, html: string, trafficHint = ""): AuditResult {
  const target = stripTrailingSlash(normalizeUrl(rawUrl));
  const checks: AuditCheck[] = [];

  const title = extract(/<title[^>]*>(.*?)<\/title>/is, html);
  checks.push({
    id: "title",
    label: "Title tag",
    passed: !!title && title.length >= 10 && title.length <= 75,
    detail: title ? `${title.slice(0, 80)} (${title.length} chars, ideal 10–60)` : "Missing",
    weight: 10,
    group: "content",
  });

  const desc = metaContent(html, "name", "description");
  checks.push({
    id: "desc",
    label: "Meta description",
    passed: !!desc && desc.length >= 50,
    detail: desc ? `${desc.slice(0, 100)}… (${desc.length} chars, ideal 120–160)` : "Missing",
    weight: 10,
    group: "content",
  });

  const h1Count = [...html.matchAll(/<h1[\s>]/gi)].length;
  checks.push({
    id: "h1",
    label: "H1 heading",
    passed: h1Count === 1,
    detail: `${h1Count} H1 found (exactly 1 ideal)`,
    weight: 8,
    group: "structure",
  });

  const canonicals = [...html.matchAll(/rel=["']canonical["'][^>]*href=["']([^"']+)["']/gi)].map((m) => m[1]);
  const canonicalOk = canonicals.length === 1 && resolveUrlMaybe(canonicals[0], target) === target;
  checks.push({
    id: "canonical",
    label: "Canonical tag",
    passed: canonicalOk,
    detail: canonicals.length ? `found ${canonicals.length}: ${canonicals[0]}` : "Missing",
    weight: 10,
    group: "technical",
  });

  const og = {
    url: !!metaContent(html, "property", "og:url"),
    title: !!metaContent(html, "property", "og:title"),
    desc: !!metaContent(html, "property", "og:description"),
    image: !!metaContent(html, "property", "og:image"),
  };
  checks.push({
    id: "og",
    label: "Open Graph tags",
    passed: og.url && og.title && og.desc && og.image,
    detail: `url=${og.url ? "✓" : "✗"} title=${og.title ? "✓" : "✗"} desc=${og.desc ? "✓" : "✗"} image=${og.image ? "✓" : "✗"}`,
    weight: 8,
    group: "social",
  });

  const twitterCard = metaContent(html, "name", "twitter:card");
  checks.push({
    id: "twitter",
    label: "Twitter card",
    passed: !!twitterCard,
    detail: twitterCard || "Missing",
    weight: 4,
    group: "social",
  });

  const jsonLdScripts = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  const jsonLdValid = jsonLdScripts.some((script) => {
    try {
      JSON.parse(script[1] || "");
      return true;
    } catch {
      return false;
    }
  });
  checks.push({
    id: "schema",
    label: "JSON-LD structured data",
    passed: jsonLdValid,
    detail: `${jsonLdScripts.length} schema script(s), ${jsonLdValid ? "valid" : "invalid/missing"}`,
    weight: 10,
    group: "technical",
  });

  const images = [...html.matchAll(/<img[^>]*>/gi)].map((t) => t[0]);
  const noAlt = images.filter((t) => !/alt=/i.test(t)).length;
  checks.push({
    id: "alt",
    label: "Image alt text",
    passed: images.length === 0 || noAlt === 0,
    detail: `${images.length - noAlt}/${images.length} images have alt (${noAlt} missing)`,
    weight: 6,
    group: "content",
  });

  const headings = [...html.matchAll(/<h([1-6])[\s>]/gi)].map((m) => Number(m[1]));
  checks.push({
    id: "headings",
    label: "Heading hierarchy",
    passed: headings.indexOf(1) !== -1,
    detail: `h1=${headings.filter((h) => h === 1).length}, h2=${headings.filter((h) => h === 2).length}, h3=${headings.filter((h) => h === 3).length}`,
    weight: 6,
    group: "structure",
  });

  const viewport = metaContent(html, "name", "viewport");
  checks.push({
    id: "viewport",
    label: "Mobile viewport",
    passed: !!viewport && /width=device-width/i.test(viewport || ""),
    detail: viewport || "Missing",
    weight: 8,
    group: "technical",
  });

  const langAttr = extract(/<html[^>]*lang=["']([^"']*)["']/i, html);
  checks.push({
    id: "lang",
    label: "HTML lang attribute",
    passed: !!langAttr,
    detail: langAttr || "Missing",
    weight: 4,
    group: "technical",
  });

  const robots = metaContent(html, "name", "robots");
  const blocksIndexing = !!robots && /(^|,|\s)(noindex|none)(,|\s|$)/i.test(robots);
  checks.push({
    id: "robots",
    label: "Robots indexing",
    passed: !blocksIndexing,
    detail: robots ? `robots="${robots}"${blocksIndexing ? " blocks indexing" : " allows indexing"}` : "No robots block found",
    weight: 8,
    group: "technical",
  });

  const internalLinks = [...html.matchAll(/<a[^>]+href=["']([^"']+)["']/gi)]
    .map((m) => m[1])
    .filter((href) => href && !href.startsWith("#") && !/^mailto:|^tel:|^javascript:/i.test(href))
    .filter((href) => href.startsWith("/") || href.includes(new URL(target).hostname));
  checks.push({
    id: "internal-links",
    label: "Internal link structure",
    passed: internalLinks.length >= 3,
    detail: `${internalLinks.length} useful internal link(s) found (ideal 3+)`,
    weight: 6,
    group: "structure",
  });

  const bodyLen = textContent(html).length;
  checks.push({
    id: "body",
    label: "Content depth",
    passed: bodyLen > 200,
    detail: `${bodyLen} chars of body text (ideal > 200)`,
    weight: 6,
    group: "content",
  });

  const total = checks.length;
  const passed = checks.filter((c) => c.passed).length;
  const score = Math.round((passed / total) * 100);

  return { url: target, score, passed, total, checks, createdAt: new Date().toISOString(), trafficHint };
}

export function revenueLeakEstimate(score: number, monthlyVisitors: number) {
  const safety = Math.min(100, Math.max(0, score));
  const leakFactor = (100 - safety) / 100;
  const estimatedMonthly = Math.round(monthlyVisitors * 0.012 * leakFactor * 25);
  return {
    perMonthInr: estimatedMonthly,
    perYearInr: Math.round(estimatedMonthly * 12),
  };
}

const FIXES: Record<string, string> = {
  title: "Write a clear priority-keyword title (10-60 characters) that confirms the visitor's search intent.",
  desc: "Write a 120-160 character meta description with keyword, value, and CTA in one concise line.",
  h1: "Keep exactly one H1 on the page that covers the primary keyword and visitor promise.",
  canonical: "Add one self-referencing canonical on every page to avoid duplicate-content confusion.",
  og: "Set og:title, og:description, and a 1200x630 image so WhatsApp, Google, and LinkedIn show a proper preview.",
  twitter: "Add twitter:card=summary_large_image so shared links get a large preview.",
  schema: "Add Organization, LocalBusiness, WebSite, and Breadcrumb JSON-LD to support rich results.",
  alt: "Add descriptive alt text on every product or utility image without keyword stuffing.",
  H1: "Keep one H1 on the page and build the topic hierarchy with H2/H3 headings.",
  headings: "Organize content with logical H2/H3 subheadings to improve readability and topic authority.",
  viewport: "Run a mobile-first check because most traffic can come from mobile devices.",
  lang: "Set the <html> lang attribute (en or en-IN) to improve language targeting.",
  robots: "Remove noindex/none from production pages unless the page is intentionally private.",
  "internal-links": "Add useful internal links to services, contact, pricing, FAQ, and related pages so visitors and crawlers can move through the site.",
  body: "Add 200+ words of meaningful unique content on each page and remove thin pages.",
};

export type AuditInsight = { id: string; issue: string; fix: string };

export function auditInsights(checks: AuditCheck[]): AuditInsight[] {
  return checks
    .filter((c) => !c.passed)
    .sort((a, b) => b.weight - a.weight)
    .map((c) => ({ id: c.id, issue: `${c.label} — ${c.detail}`, fix: FIXES[c.id] || `Improve: ${c.label}` }));
}

export function buildRoadmap(insights: AuditInsight[]) {
  if (insights.length === 0) return { "30 Days": [], "60 Days": [], "90 Days": [] };
  const buckets: AuditInsight[][] = [[], [], []];
  insights.forEach((ins, index) => {
    buckets[index % 3].push(ins);
  });
  return { "30 Days": buckets[0], "60 Days": buckets[1], "90 Days": buckets[2] };
}

export async function toCsv(results: AuditResult[]) {
  const header = "URL,Score,Passed,Timestamp";
  const rows = results.map(
    (r) => `"${r.url}","${r.score}% (${r.passed}/${r.total})","${r.createdAt}"`
  );
  return [header, ...rows].join("\n");
}

export type BusinessLine = {
  id: string;
  heading: string;
  detail: string;
};

const BUSINESS_IMPACT: Record<string, string> = {
  title: "The title is the largest headline in Google results. A missing or weak title lowers click-through rate.",
  desc: "The meta description works like search-result ad copy. Without it, visitors have less reason to click.",
  h1: "A clear H1 tells Google what the page is about. Multiple H1s can confuse page relevance.",
  canonical: "Duplicate pages confuse search engines. A self-referencing canonical gives a stronger indexing signal.",
  og: "Without Open Graph tags, shared links on WhatsApp, Facebook, and LinkedIn can lose image/title/description previews.",
  twitter: "Without a Twitter/X card, shared links feel less polished and can attract fewer clicks.",
  schema: "Without JSON-LD, Google may not show rich snippets such as ratings, prices, or FAQs.",
  alt: "Missing image alt text hurts image search visibility and accessibility for screen-reader users.",
  headings: "Without heading hierarchy, search engines and visitors struggle to understand the page structure.",
  viewport: "Most traffic is mobile. Poor mobile support can lower rankings and cause visitors to leave.",
  lang: "The lang attribute tells browsers and search engines which language the content uses.",
  robots: "A noindex robots tag can stop the page from appearing in Google results completely.",
  "internal-links": "Internal links distribute authority and help visitors discover related services or contact paths.",
  body: "Thin content does not prove usefulness to Google. Pages need enough unique content to rank well.",
};

// Highest-weight failing checks first, capped at 5
export function businessSummary(
  result: Pick<AuditResult, "score" | "checks">,
  leak: { perMonthInr: number; perYearInr: number } | null,
  insights: AuditInsight[]
): { headline: string; intro: string; items: BusinessLine[]; plan: { label: string; action: AuditInsight[] }[] } {
  const fails = result.checks.filter((c) => !c.passed).sort((a, b) => b.weight - a.weight);
  const top = fails.slice(0, 5);

  const score = result.score;
  const grade = score >= 80 ? "Strong" : score >= 50 ? "Average" : "Weak";
  const leakPhrase = leak && leak.perYearInr > 0
    ? `Poor optimization may cost this website roughly ₹${leak.perYearInr.toLocaleString("en-IN")} in potential business every year (estimate only, not a guarantee).`
    : "On-page issues can reduce the website's conversion rate.";

  const passedCount = result.checks.filter((c) => c.passed).length;
  const intro = `Score ${score}/100 — ${grade}. ${passedCount}/${result.checks.length} checks are passing. ${leakPhrase}`;

  const items: BusinessLine[] = top.map((c) => ({
    id: c.id,
    heading: c.label,
    detail: `${BUSINESS_IMPACT[c.id] || c.detail} Fix: ${FIXES[c.id] || "review the details"}`,
  }));

  const plan: { label: string; action: AuditInsight[] }[] = [
    { label: "This Week", action: insights.slice(0, 3) },
    { label: "This Month", action: insights.slice(3, 6) },
    { label: "Next Quarter", action: insights.slice(6, 9) },
  ].filter((p) => p.action.length);

  const headline = score >= 80
    ? "Your website has a strong SEO foundation."
    : score >= 50
    ? "The website is understandable, but targeted improvements can increase traffic and leads."
    : "The website has major basic SEO issues that should be fixed first.";

  return { headline, intro, items, plan };
}

export function downloadText(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

export type CroTip = {
  id: string;
  title: string;
  detail: string;
};

const CRO_TIPS: Record<string, Omit<CroTip, "id">> = {
  title: { title: "Make the headline convert", detail: "Use a clear benefit-driven promise in both the search result and first screen so visitors know what they get and why it matters now." },
  desc: { title: "Write stronger search copy", detail: "Create a 160-character meta description with keyword, value, and CTA. A weak description can reduce CTR." },
  h1: { title: "One H1, one promise", detail: "Use one main heading that states the primary keyword and value proposition. Multiple H1s confuse search engines and visitors." },
  canonical: { title: "Consolidate duplicate content", detail: "Use one self-referencing canonical on every main page so search engines receive a clear indexing signal." },
  og: { title: "Improve shared-link previews", detail: "Add a 1200x630 preview image for WhatsApp and LinkedIn shares. Links without images often receive fewer clicks." },
  twitter: { title: "Prepare the Twitter/X card", detail: "Add a summary_large_image card so shared content displays a large preview image." },
  schema: { title: "Improve rich-result eligibility", detail: "Add rating, price, and FAQ JSON-LD where relevant to increase search-result visibility." },
  alt: { title: "Make images work in search", detail: "Use descriptive, keyword-aware image alt text for image SEO and accessibility." },
  headings: { title: "Create a scannable structure", detail: "Clarify sections with H2/H3 headings so visitors can understand the page in a few seconds." },
  viewport: { title: "Fix the mobile experience", detail: "Most traffic is mobile. Correct viewport setup makes mobile CTAs and forms easier to use." },
  lang: { title: "Clarify language targeting", detail: "Set the lang attribute so browsers, LLMs, and search engines understand the page language." },
  robots: { title: "Keep the page indexable", detail: "Remove accidental noindex/none directives on pages that should appear in Google." },
  "internal-links": { title: "Guide visitors to the next step", detail: "Add clear internal links to services, contact, related pages, and trust sections so users continue the journey." },
  body: { title: "Prove quality with content depth", detail: "Use 200+ words of unique content to build authority. Thin pages often lose both rankings and users." },
};

export function croRecommendations(checks: AuditCheck[]): CroTip[] {
  const failures = checks.filter((c) => !c.passed).sort((a, b) => b.weight - a.weight);
  const applied = failures.map((c) => ({ id: c.id, ...(CRO_TIPS[c.id] || { title: c.label, detail: `Fix: ${c.detail}` }) }));
  if (applied.length === 0) {
    return [
      { id: "all", title: "Conversion looks strong", detail: "All on-page checks pass. Next, test the primary CTA, form length, trust badges, and social proof." },
    ];
  }
  return applied.slice(0, 6);
}

export type SrsRequirement = { code: string; title: string; action: string; effort: string; criteria: string };
export type SrsSection = { group: string; title: string; requirements: SrsRequirement[]; ok: string[] };

const SCS_GROUP_TITLES: Record<string, string> = {
  technical: "Technical SEO",
  content: "Content & Messaging",
  social: "Social Preview / Sharing",
  structure: "Site Structure",
};

export function srsDocument(result: AuditResult, siteName: string) {
  const groups = ["technical", "content", "social", "structure"];
  const sections: SrsSection[] = groups.map((group) => {
    const inGroup = result.checks.filter((c) => c.group === group);
    const failed = inGroup.filter((c) => !c.passed);
    const ok = inGroup.filter((c) => c.passed).map((c) => c.label);
    const requirements: SrsRequirement[] = failed.map((c, i) => ({
      code: `${group.slice(0, 3).toUpperCase()}-${String(i + 1).padStart(2, "0")}`,
      title: c.label,
      action: FIXES[c.id] || `Fix: ${c.label}`,
      effort: c.weight >= 10 ? "1 day" : c.weight >= 6 ? "2-4 hours" : "1-2 hours",
      criteria: `${c.detail} — ${BUSINESS_IMPACT[c.id] || c.detail}`,
    }));
    return { group, title: SCS_GROUP_TITLES[group] || group, requirements, ok };
  });
  const passes = result.checks.filter((c) => c.passed).length;
  return {
    project: siteName || result.url,
    score: result.score,
    summary: `${result.url} — Growth Score ${result.score}/100. ${passes}/${result.checks.length} checks pass.`,
    generatedAt: new Date().toISOString(),
    sections: sections.filter((s) => s.requirements.length > 0),
    okList: sections.flatMap((s) => s.ok),
  };
}

export function srsToText(srs: ReturnType<typeof srsDocument>) {
  const lines = [
    `SEO & Requirements Specification (SRS)`,
    `Project: ${srs.project}`,
    `Growth Score: ${srs.score}/100`,
    `Generated: ${new Date(srs.generatedAt).toLocaleString("en-IN")}`,
    "",
    "PASSED:",
    srs.okList.length ? srs.okList.map((x) => `✓ ${x}`).join("\n") : "—",
    "",
  ];
  for (const section of srs.sections) {
    lines.push(`\n## ${section.title}`, "");
    for (const r of section.requirements) {
      lines.push(`[${r.code}] ${r.title} (${r.effort})`, `  Criterion: ${r.criteria}`, `  Action: ${r.action}`, "");
    }
  }
  return lines.join("\n");
}

export function competitorGapSummary(mine: { score: number; checks: AuditCheck[] }, theirs: { score: number; checks: AuditCheck[] }) {
  const minePass = (id: string) => mine.checks.find((c) => c.id === id)?.passed ?? false;
  const theirsPass = (id: string) => theirs.checks.find((c) => c.id === id)?.passed ?? false;
  const gaps = mine.checks
    .filter((c) => !c.passed && theirsPass(c.id))
    .map((c) => ({ id: c.id, label: c.label, detail: c.detail, fix: FIXES[c.id] || `Fix: ${c.label}` }));
  const advantages = theirs.checks
    .filter((c) => !c.passed && minePass(c.id))
    .map((c) => ({ id: c.id, label: c.label }));
  return {
    myScore: mine.score,
    competitorScore: theirs.score,
    difference: mine.score - theirs.score,
    gaps,
    advantages,
    verdict: mine.score > theirs.score ? "You lead" : theirs.score > mine.score ? "Competitor leads" : "Tied",
  };
}

export function buildCostEstimate(input: { pages: "landing" | "business" | "corporate"; extras: string[] }) {
  const base: Record<string, number> = { landing: 3999, business: 7999, corporate: 12999 };
  const addonCost: Record<string, number> = {
    blog: 2000,
    store: 3500,
    multilingual: 2500,
    cms: 3000,
    maintenance: 5000,
  };
  const selected = input.extras.filter((e) => e in addonCost);
  const addons = selected.map((k) => ({ name: k, cost: addonCost[k] }));
  const total = base[input.pages] + addons.reduce((s, a) => s + a.cost, 0);
  return {
    pages: input.pages,
    baseCost: base[input.pages],
    addons,
    total,
    totalLabel: `₹${total.toLocaleString("en-IN")}`,
  };
}

export type EnterpriseSrsBlueprint = {
  project: string;
  score: number;
  version: string;
  stack: { framework: string; recommended: string; why: string }[];
  modules: { name: string; features: string[]; apiRoutes: string[] }[];
  prismaModels: string[];
  sprints: { phase: string; duration: string; scope: string[]; deliverables: string[] }[];
  team: { role: string; hours: number }[];
  totalHours: number;
  estimatedWeeks: number;
};

export function buildSrsBlueprint(srs: ReturnType<typeof srsDocument>): EnterpriseSrsBlueprint {
  const nReq = srs.sections.reduce((n, s) => n + s.requirements.length, 0);
  const scale = nReq >= 8 ? "corporate" : nReq >= 4 ? "business" : "landing";
  const frontend = scale === "corporate" ? "React 19 + Next.js (SSR) + Tailwind v4 + Motion" : "React 19 + Vite + Tailwind v4 + Motion (current stack)";
  const backend = scale === "corporate" ? "Node.js 22 + Express + PostgreSQL/Prisma (Cloud Run)" : "Node.js + Express + PostgreSQL/Prisma";

  const stack = [
    { framework: "Frontend", recommended: frontend, why: "Production-grade SPA. The app already runs on React 19 and Tailwind v4, so staying in this ecosystem is cost-effective." },
    { framework: "Backend & API", recommended: backend, why: nReq <= 6 ? "A custom server is not required. Netlify Functions are sufficient." : "Multi-tenant data, billing, and lead routing require a persistent runtime." },
    { framework: "Database", recommended: scale === "corporate" ? "PostgreSQL + Prisma" : "SQLite dev + PostgreSQL prod + Prisma", why: "Schema-first workflow, reliable migrations." },
    { framework: "AI Engine", recommended: nReq === 0 ? "—" : "Google Gemini API (@google/genai 2.x) — server-side only", why: "Keep copilot recommendations reliable and never expose secret keys in the client bundle." },
    { framework: "Infrastructure", recommended: scale === "corporate" ? "Docker + Cloud Run + managed Postgres" : "Netlify + prerender + CDN", why: nReq <= 6 ? "Prerender static routes + CDN caching enough." : "Burst JIT for peak audit volume, cache SEO reports." },
  ];

  const modules = [
    { name: "Auth & Workspace", features: ["Email OTP / Google OAuth", "Org seats & roles", "Brand customizer"], apiRoutes: ["POST /api/auth/*", "GET /api/org/seats", "PATCH /api/brand"] },
    { name: "Audit Engine", features: ["14-point on-page audit", "CWV/lighthouse enrichment (optional)", "Scheduled re-audits"], apiRoutes: ["POST /api/audits", "GET /api/audits/:id", "GET /api/audits/:id/timeline"] },
    { name: "Lead & Report Delivery", features: ["Audit report capture", "Email/WhatsApp lead routing", "PDF and markdown exports"], apiRoutes: ["POST /api/audit-leads", "POST /api/report/export", "GET /api/audits/:id/download"] },
    { name: "AI Copilot", features: ["Report summarizer", "SRS blueprint generator", "Personalized roadmap"], apiRoutes: ["POST /api/ai/report", "POST /api/ai/srs", "GET /api/ai/suggestions"] },
    { name: "CRM & WhatsApp", features: ["Lead routing", "Webhook digests", "CRM tags"], apiRoutes: ["POST /api/leads/routes", "POST /api/webhooks/:type", "GET /api/leads/activity"] },
  ];

  const prismaModels = [
    `model Organization {
  id String @id @default(cuid())
  name String
  brandJson Json?
  seats Int @default(1)
  createdAt DateTime @default(now())
  audits Audit[]
  members User[]
}`,
    `model User {
  id String @id @default(cuid())
  email String @unique
  name String?
  role String @default("MEMBER")
  orgId String?
  org Organization? @relation(fields: [orgId], references: [id])
}`,
    `model Audit {
  id String @id @default(cuid())
  url String
  score Int
  checks Json
  leak Json?
  srs Json?
  orgId String?
  createdAt DateTime @default(now())
  @@index([url, createdAt])
}`,
    `model ProjectEstimate {
  id String @id @default(cuid())
  orgId String
  amount Int
  gst Int
  scope Json
  status String @default("DRAFT")
  createdAt DateTime @default(now())
}`,
    `model LeadRoute {
  id String @id @default(cuid())
  orgId String
  trigger String
  target String?
  crmTag String?
  active Boolean @default(true)
}`,
  ];

  const sprints = [
    { phase: "Sprint 1", duration: "Week 1-2", scope: ["Audit workspace skeleton", "Report storage model"], deliverables: ["Audit dashboard", "Tracked sites", "Prisma migration #1"] },
    { phase: "Sprint 2", duration: "Week 3-4", scope: ["Audit engine API + storage", "Report export workflow"], deliverables: ["POST /api/audits", "PDF and markdown exports"] },
    { phase: "Sprint 3", duration: "Week 5-6", scope: ["AI copilot (Gemini)", "Lead routing", "CRM/webhook pipeline"], deliverables: ["/api/ai/srs", "Lead alerts", "Client handoff active"] },
  ];

  const estimatedWeeks = scale === "corporate" ? 8 : nReq <= 6 ? 4 : 6;
  const team = [
    { role: "Frontend Eng", hours: 64 },
    { role: "Backend / API", hours: 56 },
    { role: "AI Integration", hours: 40 },
    { role: "QA & DevOps", hours: 32 },
  ];
  const totalHours = team.reduce((s, r) => s + r.hours, 0);

  return {
    project: srs.project,
    score: srs.score,
    version: `REV-${srs.generatedAt.slice(0, 10).replace(/-/g, "")}`,
    stack,
    modules,
    prismaModels,
    sprints,
    team,
    totalHours,
    estimatedWeeks,
  };
}

export function srsBlueprintMd(bp: EnterpriseSrsBlueprint) {
  const lines = [
    `# Enterprise SRS Blueprint — ${bp.project}`,
    `Growth Score ${bp.score}/100 · v${bp.version}`,
    "",
    "## System Architecture & Tech Stack",
  ];
  for (const s of bp.stack) lines.push(`- **${s.framework}:** ${s.recommended} — ${s.why}`);
  lines.push("", "## Core Modules & API Routes");
  for (const m of bp.modules) {
    lines.push(`### ${m.name}`, `- Features: ${m.features.join(", ")}`, `- Routes: ${m.apiRoutes.join(", ")}`, "");
  }
  lines.push("## Database Schema (Prisma)", "", "```prisma", bp.prismaModels.join("\n\n"), "```", "", "## Sprint Schedule");
  for (const sp of bp.sprints) {
    lines.push(`- **${sp.phase}** (${sp.duration}): ${sp.scope.join("; ")} — Deliverables: ${sp.deliverables.join(", ")}`);
  }
  lines.push("", "## Team & Effort Estimate", `- ~${bp.totalHours} engineering hours across ~${bp.estimatedWeeks} weeks.`);
  for (const r of bp.team) lines.push(`- ${r.role}: ${r.hours}h`);
  return lines.join("\n");
}

export type Invoice = {
  base: number;
  gstRate: number;
  gstAmount: number;
  total: number;
  oneTime: boolean;
};

export function buildInvoice(costEstimate: ReturnType<typeof buildCostEstimate>): Invoice {
  const base = costEstimate.total;
  const gstAmount = Math.round((base * 18) / 100);
  return {
    base,
    gstRate: 18,
    gstAmount,
    total: base + gstAmount,
    oneTime: true,
  };
}

export function buildROI(invoice: ReturnType<typeof buildInvoice>, monthlyVisitors: number, score = 50) {
  const leak = revenueLeakEstimate(score, monthlyVisitors);
  const avoidedLeakPerMonth = leak.perMonthInr;
  const breakevenMonths = invoice.total > 0 ? Math.ceil(invoice.total / (avoidedLeakPerMonth || 1)) : 0;
  return {
    annualRecoverable: leak.perYearInr,
    perMonthSaved: avoidedLeakPerMonth,
    breakevenMonths,
    message: breakevenMonths > 0 ? `Capital can be recovered in ~${breakevenMonths} months; after that, roughly ₹${avoidedLeakPerMonth.toLocaleString("en-IN")} in monthly leakage can be reduced.` : "The investment has immediate ROI because there is no leak to recover.",
  };
}

export type CompetitorRow =
  | { kind: "head"; label: string; values: (string | number)[] }
  | { kind: "score"; label: string; values: (string | number)[] }
  | { kind: "verdict"; label: string }
  | { kind: "data"; label: string; values: (string | number)[] };

export function competitorMatrix3(
  mine: Pick<AuditResult, "score" | "checks" | "url">,
  cmp1: Pick<AuditResult, "score" | "checks" | "url">,
  cmp2: Pick<AuditResult, "score" | "checks" | "url">
) {
  const pass = (c: { checks: AuditCheck[] }, id: string) => c.checks.find((x) => x.id === id)?.passed ?? false;
  const scores = [mine.score, cmp1.score, cmp2.score];
  const leader = Math.max(...scores);
  const verdict =
    mine.score === leader
      ? "You lead the table"
      : cmp1.score === leader && cmp2.score === leader
      ? "Both competitors tie for 1st"
      : "A competitor takes the table";

  const gaps: { check: string; you: string; they: (string | number)[] }[] = [];
  for (const c of mine.checks) {
    const id = c.id;
    const minePass = pass(mine, id);
    const c1Pass = pass(cmp1, id);
    const c2Pass = pass(cmp2, id);
    if (!minePass && (c1Pass || c2Pass)) {
      gaps.push({ check: c.label, you: "✗", they: [c1Pass ? "✓" : "✗", c2Pass ? "✓" : "✗"] });
    }
  }

  const rows: CompetitorRow[] = [
    { kind: "head", label: "", values: ["Your Site", cmp1.url, cmp2.url] },
    { kind: "score", label: "Score", values: [...scores] },
    { kind: "verdict", label: verdict },
    ...gaps.map((g) => ({ kind: "data" as const, label: g.check, values: [g.you, ...g.they] })),
  ];

  return { rows, verdict, gaps, scores };
}
