import { describe, it, expect } from "vitest";
import { businessSummary, auditInsights, type AuditResult } from "./auditEngine";

function sampleResult(overrides: Partial<AuditResult> = {}): AuditResult {
  return {
    url: "https://example.com",
    score: 42,
    passed: 3,
    total: 6,
    createdAt: new Date().toISOString(),
    trafficHint: "~1000 visitors/mo",
    checks: [
      { id: "title", label: "Title tag", passed: false, detail: "Missing", weight: 10, group: "content" },
      { id: "schema", label: "JSON-LD structured data", passed: false, detail: "Missing", weight: 10, group: "technical" },
      { id: "h1", label: "H1 heading", passed: false, detail: "0 H1 found", weight: 8, group: "structure" },
      { id: "viewport", label: "Mobile viewport", passed: true, detail: "OK", weight: 8, group: "technical" },
      { id: "alt", label: "Image alt text", passed: true, detail: "OK", weight: 6, group: "content" },
      { id: "body", label: "Content depth", passed: true, detail: "OK", weight: 6, group: "content" },
    ],
    ...overrides,
  };
}

describe("businessSummary", () => {
  it("orders failing checks by weight and returns actionable business language", () => {
    const result = sampleResult();
    const insights = auditInsights(result.checks);
    const leak = { perMonthInr: 10000, perYearInr: 120000 };
    const summary = businessSummary(result, leak, insights);

    // only 3 checks fail
    expect(summary.items.length).toBe(3);
    // highest weight first (title/schema weight 10 before h1 weight 8)
    expect(summary.items[0].heading).toBe("Title tag");
    expect(summary.items[1].heading).toBe("JSON-LD structured data");

    // every item must have an impact + fix line (the AI-free translation layer)
    for (const item of summary.items) {
      expect(item.detail.length).toBeGreaterThan(30);
      expect(item.detail).toContain("Fix:");
    }

    // revenue leak framing + score
    expect(summary.intro).toContain("42/100");
    expect(summary.intro).toContain("₹1,20,000");

    // week-plan derived from insights
    expect(summary.plan.length).toBeGreaterThan(0);
    expect(summary.plan[0].label).toBe("This Week");
  });

  it("handles a perfect score without crashing and returns a strong headline", () => {
    const all = sampleResult().checks.map((c) => ({ ...c, passed: true }));
    const result: AuditResult = { ...sampleResult(), score: 95, checks: all, passed: 6, total: 6 };
    const summary = businessSummary(result, { perMonthInr: 0, perYearInr: 0 }, []);

    expect(summary.items.length).toBe(0);
    expect(summary.intro).toContain("95/100");
    expect(summary.headline).toBe("Your website has a strong SEO foundation.");
  });
});
