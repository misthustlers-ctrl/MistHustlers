import { describe, it, expect } from "vitest";
import {
  croRecommendations, srsDocument, srsToText, competitorGapSummary, buildCostEstimate,
  buildSrsBlueprint, srsBlueprintMd, competitorMatrix3, buildInvoice, buildROI,
  type AuditResult,
} from "./auditEngine";

function sampleResult(overrides: Partial<AuditResult> = {}): AuditResult {
  return {
    url: "https://example.com",
    score: 42,
    passed: 2,
    total: 6,
    createdAt: "2026-01-01T00:00:00.000Z",
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

describe("croRecommendations", () => {
  it("returns one tip per failing check, honoring weight order", () => {
    const result = sampleResult();
    const tips = croRecommendations(result.checks);
    expect(tips.length).toBe(3);
    expect(tips[0].title.length).toBeGreaterThan(0);
    expect(tips[0].detail.length).toBeGreaterThan(10);
  });

  it("returns positive fallback when everything passes", () => {
    const all = sampleResult().checks.map((c) => ({ ...c, passed: true }));
    const tips = croRecommendations(all);
    expect(tips.length).toBeGreaterThanOrEqual(1);
    expect(tips[0].id).toBe("all");
  });
});

describe("srsDocument", () => {
  it("groups failing checks by section with priorities and effort", () => {
    const result = sampleResult();
    const srs = srsDocument(result, "Acme");
    expect(srs.project).toBe("Acme");
    expect(srs.score).toBe(result.score);
    expect(srs.sections.length).toBeGreaterThan(0);
    const reqCount = srs.sections.reduce((n, s) => n + s.requirements.length, 0);
    expect(reqCount).toBe(3);
    // each requirement is actionable
    for (const section of srs.sections) {
      for (const req of section.requirements) {
        expect(req.code).toMatch(/^[A-Z]{3}-\d{2}$/);
        expect(req.action.length).toBeGreaterThan(10);
        expect(req.effort.length).toBeGreaterThan(0);
      }
    }
    // passing checks land in the okList
    expect(srs.okList.length).toBe(3);
  });

  it("handles a perfect score", () => {
    const all = sampleResult().checks.map((c) => ({ ...c, passed: true }));
    const result: AuditResult = { ...sampleResult(), score: 95, checks: all, passed: 6, total: 6 };
    const srs = srsDocument(result, "Site");
    expect(srs.sections.length).toBe(0);
    expect(srs.okList.length).toBe(6);
  });
});

describe("srsToText", () => {
  it("produces a readable spec document containing codes and actions", () => {
    const result = sampleResult();
    const srs = srsDocument(result, "Acme");
    const text = srsToText(srs);
    expect(text).toContain("SEO & Requirements Specification");
    expect(text).toContain("CON-01");
    expect(text).toContain("Action:");
    expect(text).toContain("PASSED:");
  });
});

describe("competitorGapSummary", () => {
  const myResult = sampleResult();
  const strongCompetitor: AuditResult = {
    ...sampleResult(),
    url: "https://rival.com",
    score: 85,
    passed: 5,
    checks: myResult.checks.map((c) => ({ ...c, passed: c.id === "title" || c.id === "schema" || c.id === "h1" })),
  };

  it("finds gaps where competitor passes and you fail", () => {
    const gap = competitorGapSummary(myResult, strongCompetitor);
    expect(gap.difference).toBeLessThan(0);
    expect(gap.gaps.length).toBe(3); // title, schema, h1 competitor has, you don't
    expect(gap.gaps.map((g) => g.id).sort()).toEqual(["h1", "schema", "title"]);
    expect(gap.advantages.length).toBe(3); // viewport, alt, body you have, competitor doesn't
    expect(gap.verdict).toBe("Competitor leads");
  });

  it("handles a tie", () => {
    const scar = competitorGapSummary(myResult, { ...myResult });
    expect(scar.difference).toBe(0);
    expect(scar.verdict).toBe("Tied");
    expect(scar.gaps.length).toBe(0);
  });
});

describe("buildCostEstimate", () => {
  it("computes base + addons", () => {
    const r = buildCostEstimate({ pages: "business", extras: ["blog", "store"] });
    expect(r.baseCost).toBe(7999);
    expect(r.addons.length).toBe(2);
    expect(r.total).toBe(7999 + 2000 + 3500);
    expect(r.totalLabel).toBe("₹13,499");
  });

  it("ignores unknown extras", () => {
    const r = buildCostEstimate({ pages: "landing", extras: ["unknown"] });
    expect(r.addons.length).toBe(0);
    expect(r.total).toBe(3999);
  });
});

describe("buildInvoice", () => {
  it("computes one-time base + 18% GST without subscription", () => {
    const r = buildCostEstimate({ pages: "business", extras: [] });
    const inv = buildInvoice(r);
    expect(inv.base).toBe(r.total);
    expect(inv.gstRate).toBe(18);
    expect(inv.gstAmount).toBe(Math.round((r.total * 18) / 100));
    expect(inv.total).toBe(inv.base + inv.gstAmount);
    expect(inv.oneTime).toBe(true);
  });

  it("keeps landing invoices one-time only", () => {
    const r = buildCostEstimate({ pages: "landing", extras: [] });
    const inv = buildInvoice(r);
    expect(inv.base).toBe(3999);
    expect(inv.oneTime).toBe(true);
  });
});

describe("buildROI", () => {
  it("gives positive outlook with recoverable amount", () => {
    const r = buildCostEstimate({ pages: "business", extras: ["store"] });
    const inv = buildInvoice(r);
    const roi = buildROI(inv, 1000);
    expect(roi.annualRecoverable).toBeGreaterThan(0);
    expect(roi.message).toContain("₹");
    expect(roi.breakevenMonths).toBeGreaterThan(0);
  });
});

describe("buildSrsBlueprint", () => {
  it("returns stack, sprints, team and effort numbers", () => {
    const srs = srsDocument(sampleResult(), "Acme");
    const bp = buildSrsBlueprint(srs);
    expect(bp.version).toMatch(/^REV-\d{8}$/);
    expect(bp.stack.length).toBeGreaterThan(0);
    expect(bp.modules.length).toBeGreaterThan(0);
    expect(bp.prismaModels.length).toBeGreaterThan(0);
    expect(bp.sprints[0].phase).toBe("Sprint 1");
    expect(bp.team.length).toBeGreaterThan(0);
    expect(bp.totalHours).toBeGreaterThan(0);
    expect(bp.estimatedWeeks).toBeGreaterThan(0);
  });
});

describe("srsBlueprintMd", () => {
  it("renders a markdown doc with sections", () => {
    const srs = srsDocument(sampleResult(), "Acme");
    const bp = buildSrsBlueprint(srs);
    const md = srsBlueprintMd(bp);
    expect(md).toContain("# Enterprise SRS Blueprint — Acme");
    expect(md).toContain("## System Architecture & Tech Stack");
    expect(md).toContain("Sprint 1");
    expect(md).toContain("Team & Effort Estimate");
  });
});

describe("competitorMatrix3", () => {
  const my = sampleResult();
  const passedChecks = (base: AuditResult, ids: string[]) =>
    base.checks.map((c) => ({ ...c, passed: ids.includes(c.id) }));
  const rival = {
    ...sampleResult(),
    url: "https://rival.com",
    score: 85,
    passed: 5,
    checks: passedChecks(my, ["title", "schema", "h1", "viewport", "alt"]),
  };
  const rival2 = {
    ...sampleResult(),
    url: "https://other.com",
    score: 70,
    passed: 4,
    checks: passedChecks(my, ["title", "viewport", "alt", "body"]),
  };

  it("compares three sites with head, score and data rows", () => {
    const m = competitorMatrix3(my, rival, rival2);
    const head = m.rows[0];
    expect(head.kind).toBe("head");
    if (head.kind === "head") expect(head.values.length).toBe(3);
    expect(m.scores).toEqual([my.score, rival.score, rival2.score]);
    expect(m.rows.some((r) => r.kind === "score")).toBe(true);
    expect(m.rows.some((r) => r.kind === "data")).toBe(true);
    expect(m.rows.some((r) => r.kind === "verdict")).toBe(true);
  });
});
