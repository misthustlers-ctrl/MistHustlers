import template from "./auditReportTemplate.html?raw";
import type { AuditResult, AuditInsight } from "./auditEngine";
import { srsDocument } from "./auditEngine";

const GROUP_LABEL: Record<string, string> = {
  technical: "Technical",
  content: "Content",
  social: "Social",
  structure: "Structure",
};

const OWNER_BY_GROUP: Record<string, string> = {
  technical: "DevOps",
  content: "Content",
  social: "Frontend",
  structure: "Frontend",
};

function safe(value: string) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function effortOf(weight: number) {
  return weight >= 9 ? "1 day" : weight >= 7 ? "4 h" : "1–2 h";
}

function impactOf(weight: number) {
  return weight >= 9 ? "High" : weight >= 7 ? "Medium" : "Low";
}

function gainOf(weight: number) {
  return `+${Math.round(weight * 1.5)} pts`;
}

function priOf(effort: string) {
  return effort === "1 day" ? "Must" : effort === "2-4 hours" ? "Should" : "Could";
}

export type AuditReportInput = {
  result: AuditResult;
  leak: { perMonthInr: number; perYearInr: number } | null;
  traffic: string;
  roadmap: Record<string, AuditInsight[]>;
  insights: AuditInsight[];
  siteName: string;
};

export function buildAuditReportHtml(input: AuditReportInput): string {
  const { result, leak, roadmap, insights, siteName, traffic } = input;

  const weightById = new Map(result.checks.map((c) => [c.id, c.weight]));
  const topFixes = insights.slice(0, 5).map((i) => {
    const weight = weightById.get(i.id) ?? 6;
    return {
      code: i.id.toUpperCase(),
      fix: i.issue,
      effort: effortOf(weight),
      impact: impactOf(weight),
      gain: gainOf(weight),
    };
  });

  const srs = srsDocument(result, siteName);
  const srsRows = srs.sections.flatMap((section) =>
    section.requirements.map((r) => ({
      code: r.code,
      req: `${r.title} — ${r.action}`,
      pri: priOf(r.effort),
      owner: OWNER_BY_GROUP[section.group] || "MistHustlers",
    }))
  );

  const dateLabel = new Date(result.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const data = {
    url: result.url,
    score: result.score,
    passed: result.passed,
    total: result.total,
    trafficHint: result.trafficHint || `~${traffic || "1000"} visitors/mo`,
    revenueLeak: leak ? { perMonthInr: leak.perMonthInr, perYearInr: leak.perYearInr } : { perMonthInr: 0, perYearInr: 0 },
    client: siteName || result.url,
    reportDate: dateLabel,
    refId: `MH-SEO-${Date.now().toString(36).toUpperCase()}`,
    checks: result.checks.map((c) => ({
      id: c.id,
      label: c.label,
      passed: c.passed,
      detail: c.detail,
      weight: c.weight,
      group: GROUP_LABEL[c.group] || c.group,
    })),
    roadmap: {
      d30: (roadmap["30 Days"] || []).map((i) => ({ t: i.issue, d: i.fix })),
      d60: (roadmap["60 Days"] || []).map((i) => ({ t: i.issue, d: i.fix })),
      d90: (roadmap["90 Days"] || []).map((i) => ({ t: i.issue, d: i.fix })),
    },
    topFixes,
    srs: srsRows,
  };

  const json = JSON.stringify(data, (_key, value) => (typeof value === "string" ? safe(value) : value)).replace(
    /<\//g,
    "<\\/"
  );

  return template.replace("__AUDIT_DATA__", json);
}