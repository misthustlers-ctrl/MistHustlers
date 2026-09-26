import { describe, it, expect } from "vitest";
import {
  scoreHtml, runAudit, fetchAuditHtml, revenueLeakEstimate, toCsv,
  type AuditResult,
} from "./auditEngine";

const TITLE = "Optimal Page Title For Testing";
const DESC = "A comprehensive meta description that is well over fifty characters long.";
const PARA = "Business content words repeated to build up meaningful body copy length for the audit depth check. ";
const BODY_TEXT = PARA.repeat(5);

function wrap(headExtra = "", lang = true, body?: string, withDesc = true) {
  const langAttr = lang ? ' lang="en"' : "";
  const content = body ?? `<h1>Welcome</h1><p>${BODY_TEXT}</p>`;
  const descTag = withDesc ? `<meta name="description" content="${DESC}">` : "";
  return `<!DOCTYPE html><html${langAttr}><head><title>${TITLE}</title><meta name="viewport" content="width=device-width, initial-scale=1.0">${descTag}${headExtra}</head><body>${content}</body></html>`;
}

function goodHtml() {
  return wrap(
    `<link rel="canonical" href="https://example.com/">
     <meta property="og:url" content="https://example.com/">
     <meta property="og:title" content="OG Title"><meta property="og:description" content="OG desc">
     <meta property="og:image" content="https://example.com/og.png">
     <meta name="twitter:card" content="summary_large_image">
     <script type="application/ld+json">{"@type":"Organization","name":"exampleCo"}</script>`,
    true,
    `<h1>Welcome to the Store</h1><img src="/a.png" alt="Product A"><img src="/b.png" alt="Product B"><a href="/services">Services</a><a href="/pricing">Pricing</a><a href="/contact">Contact</a><p>${BODY_TEXT}</p>`
  );
}

function passFor(result: AuditResult, id: string) {
  return result.checks.find((c) => c.id === id)?.passed;
}

describe("scoreHtml — complete optimized page", () => {
  const result = scoreHtml("https://example.com/", goodHtml(), "~1000/mo");

  it("strips trailing slash and normalizes URL", () => {
    expect(result.url).toBe("https://example.com");
  });

  it("passes all 14 checks and scores 100", () => {
    expect(result.checks).toHaveLength(14);
    expect(result.passed).toBe(14);
    expect(result.score).toBe(100);
    for (const c of result.checks) expect(c.passed).toBe(true);
  });

  it("keeps trafficHint", () => {
    expect(result.trafficHint).toBe("~1000/mo");
  });
});

describe("title check", () => {
  it("fails when missing", () => {
    const html = `<html lang="en"><head><meta name="description" content="${"d".repeat(80)}"></head><body>${"x".repeat(320)}</body></html>`;
    expect(passFor(scoreHtml("https://example.com", html), "title")).toBe(false);
  });
  it("fails when too short (<10 chars)", () => {
    const html = `<html lang="en"><head><title>Hi</title></head><body>${"x".repeat(320)}</body></html>`;
    expect(passFor(scoreHtml("https://example.com", html), "title")).toBe(false);
  });
  it("fails when too long (>75 chars)", () => {
    const html = `<html lang="en"><head><title>${"T".repeat(90)}</title></head><body>${"x".repeat(320)}</body></html>`;
    expect(passFor(scoreHtml("https://example.com", html), "title")).toBe(false);
  });
  it("passes at 10-75 chars", () => {
    const html = wrap(`<link rel="canonical" href="https://example.com.md/"><meta name="twitter:card" content="summary"/>`);
    const r = scoreHtml("https://example.com", html);
    expect(r.checks.find((c) => c.id === "title")?.passed).toBe(true);
  });
});

describe("meta description check", () => {
  it("fails when missing", () => {
    expect(passFor(scoreHtml("https://example.com", wrap("", true, undefined, false)), "desc")).toBe(false);
  });
  it("passes when 50+ chars", () => {
    const html = `<html lang="en"><head><title>${TITLE}</title><meta name="description" content="${"d".repeat(65)}"></head><body>${"x".repeat(320)}</body></html>`;
    expect(passFor(scoreHtml("https://example.com", html), "desc")).toBe(true);
  });
  it("passes when content appears before name and uses single quotes", () => {
    const html = `<html lang="en"><head><title>${TITLE}</title><meta content='${"d".repeat(65)}' name='description'></head><body>${"x".repeat(320)}</body></html>`;
    expect(passFor(scoreHtml("https://example.com", html), "desc")).toBe(true);
  });
});

describe("h1 check", () => {
  it("passes with exactly one h1", () => {
    const html = `<html lang="en"><head><title>${TITLE}</title></head><body><h1>One</h1>${"x".repeat(320)}</body></html>`;
    expect(passFor(scoreHtml("https://example.com", html), "h1")).toBe(true);
  });
  it("fails with zero h1", () => {
    const html = `<html lang="en"><head><title>${TITLE}</title></head><body>${"x".repeat(320)}</body></html>`;
    expect(passFor(scoreHtml("https://example.com", html), "h1")).toBe(false);
  });
  it("fails with two h1", () => {
    const html = `<html lang="en"><head><title>${TITLE}</title></head><body><h1>A</h1><h1>B</h1>${"x".repeat(320)}</body></html>`;
    expect(passFor(scoreHtml("https://example.com", html), "h1")).toBe(false);
  });
});

describe("canonical check", () => {
  it("passes on single self-referencing canonical (trailing slash treated equal)", () => {
    const html = wrap(`<link rel="canonical" href="https://example.com/">`);
    expect(passFor(scoreHtml("https://example.com", html), "canonical")).toBe(true);
  });
  it("fails when pointing to a different host", () => {
    const html = wrap(`<link rel="canonical" href="https://other.com/">`);
    expect(passFor(scoreHtml("https://example.com", html), "canonical")).toBe(false);
  });
  it("fails when missing", () => {
    expect(passFor(scoreHtml("https://example.com", wrap()), "canonical")).toBe(false);
  });
  it("passes relative canonical paths", () => {
    const html = wrap(`<link rel="canonical" href="/about">`);
    expect(passFor(scoreHtml("https://example.com/about", html), "canonical")).toBe(true);
  });
});

describe("open graph check", () => {
  it("passes when all 4 required tags present", () => {
    const html = wrap(`<link rel="canonical" href="https://example.com/">
      <meta property="og:url" content="https://example.com"><meta property="og:title" content="T">
      <meta property="og:description" content="D"><meta property="og:image" content="https://example.com/i.png">`);
    expect(passFor(scoreHtml("https://example.com", html), "og")).toBe(true);
  });
  it("fails when image missing", () => {
    const html = wrap(`<link rel="canonical" href="https://example.com/">
      <meta property="og:url" content="https://example.com"><meta property="og:title" content="T">
      <meta property="og:description" content="D">`);
    expect(passFor(scoreHtml("https://example.com", html), "og")).toBe(false);
  });
});

describe("twitter card check", () => {
  it("passes when twitter:card present", () => {
    const html = wrap(`<meta name="twitter:card" content="summary_large_image">`);
    expect(passFor(scoreHtml("https://example.com", html), "twitter")).toBe(true);
  });
  it("fails when missing", () => {
    expect(passFor(scoreHtml("https://example.com", wrap()), "twitter")).toBe(false);
  });
});

describe("schema / structured data check", () => {
  it("passes on valid JSON-LD", () => {
    const html = wrap(`<script type="application/ld+json">{"@type":"Organization","name":"C"}</script>`);
    expect(passFor(scoreHtml("https://example.com", html), "schema")).toBe(true);
  });
  it("fails on malformed JSON-LD", () => {
    const html = wrap(`<script type="application/ld+json">{broken json!!!</script>`);
    expect(passFor(scoreHtml("https://example.com", html), "schema")).toBe(false);
  });
  it("fails when missing", () => {
    expect(passFor(scoreHtml("https://example.com", wrap()), "schema")).toBe(false);
  });
  it("passes when a later JSON-LD script is valid", () => {
    const html = wrap(`<script type="application/ld+json">{broken</script><script type="application/ld+json">{"@type":"LocalBusiness","name":"C"}</script>`);
    expect(passFor(scoreHtml("https://example.com", html), "schema")).toBe(true);
  });
});

describe("image alt check", () => {
  it("passes when no images present", () => {
    expect(passFor(scoreHtml("https://example.com", wrap()), "alt")).toBe(true);
  });
  it("passes when all images have alt", () => {
    const html = `<html lang="en"><head><title>${TITLE}</title></head><body><img src="a.png" alt="a">${"x".repeat(320)}</body></html>`;
    expect(passFor(scoreHtml("https://example.com", html), "alt")).toBe(true);
  });
  it("fails when any image lacks alt", () => {
    const html = `<html lang="en"><head><title>${TITLE}</title></head><body><img src="a.png"><img src="b.png" alt="b">${"x".repeat(320)}</body></html>`;
    expect(passFor(scoreHtml("https://example.com", html), "alt")).toBe(false);
  });
});

describe("heading hierarchy check", () => {
  it("passes when h1 exists", () => {
    const html = `<html lang="en"><head><title>${TITLE}</title></head><body><h1>T</h1><h2>S</h2>${"x".repeat(320)}</body></html>`;
    expect(passFor(scoreHtml("https://example.com", html), "headings")).toBe(true);
  });
  it("fails when no heading tags", () => {
    const html = `<html lang="en"><head><title>${TITLE}</title></head><body><p>only text</p>${"x".repeat(320)}</body></html>`;
    expect(passFor(scoreHtml("https://example.com", html), "headings")).toBe(false);
  });
});

describe("mobile viewport check", () => {
  it("passes when width=device-width", () => {
    expect(passFor(scoreHtml("https://example.com", wrap()), "viewport")).toBe(true);
  });
  it("passes even with extra props", () => {
    const html = `<html lang="en"><head><title>${TITLE}</title><meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1"></head><body>${"x".repeat(330)}</body></html>`;
    expect(passFor(scoreHtml("https://example.com", html), "viewport")).toBe(true);
  });
  it("fails when missing or not device-width", () => {
    const html = `<html lang="en"><head><title>${TITLE}</title></head><body>${"x".repeat(330)}</body></html>`;
    expect(passFor(scoreHtml("https://example.com", html), "viewport")).toBe(false);
  });
});

describe("lang check", () => {
  it("passes when html has lang", () => {
    expect(passFor(scoreHtml("https://example.com", wrap()), "lang")).toBe(true);
  });
  it("fails when lang missing", () => {
    const html = wrap("", false);
    expect(passFor(scoreHtml("https://example.com", html), "lang")).toBe(false);
  });
});

describe("content depth (body) check", () => {
  it("passes with >200 chars", () => {
    const html = wrap("", true, `<h1>t</h1>${"z".repeat(220)}`);
    expect(passFor(scoreHtml("https://example.com", html), "body")).toBe(true);
  });
  it("fails with <=200 chars (title text also counts)", () => {
    const html = wrap("", true, `<h1>t</h1>${"z".repeat(160)}`);
    expect(passFor(scoreHtml("https://example.com", html), "body")).toBe(false);
  });
  it("ignores script + style text when counting", () => {
    const html = `<html lang="en"><head><title>${TITLE}</title></head><body><script>${"x".repeat(5000)}</script><style>${"y".repeat(5000)}</style><h1>t</h1>${"z".repeat(201)}</body></html>`;
    expect(passFor(scoreHtml("https://example.com", html), "body")).toBe(true);
  });
});

describe("score aggregation & URL normalization", () => {
  it("checks always total 14 and score is rounded", () => {
    const r = scoreHtml("https://example.com", wrap());
    expect(r.total).toBe(14);
    expect(r.score).toBe(Math.round((r.passed / 14) * 100));
  });
  it("normalizes bare domain and single trailing slash", () => {
    expect(scoreHtml("example.com/", wrap()).url).toBe("https://example.com");
    expect(scoreHtml("https://example.com//", wrap()).url).toBe("https://example.com/");
  });
});

describe("revenueLeakEstimate", () => {
  it("lower score yields higher leak for same visitors", () => {
    const low = revenueLeakEstimate(30, 10000);
    const high = revenueLeakEstimate(90, 10000);
    expect(low.perYearInr).toBeGreaterThan(high.perYearInr);
  });
  it("returns 0 for zero visitors", () => {
    const r = revenueLeakEstimate(50, 0);
    expect(r.perMonthInr).toBe(0);
    expect(r.perYearInr).toBe(0);
  });
  it("keeps perYear as 12x of perMonth", () => {
    const r = revenueLeakEstimate(40, 5000);
    expect(r.perYearInr).toBe(r.perMonthInr * 12);
  });
});

describe("toCsv", () => {
  it("formats header + one row per result", async () => {
    const r = scoreHtml("https://example.com", goodHtml(), "~1000/mo");
    const csv = await toCsv([r]);
    expect(csv.split("\n")).toHaveLength(2);
    expect(csv).toContain("https://example.com");
    expect(csv).toContain("100% (14/14)");
  });
});

describe("fetchAuditHtml & runAudit", () => {
  it("throws on empty URL", async () => {
    await expect(fetchAuditHtml("")).rejects.toThrow("URL");
  });

  it("runAudit normalizes input and scores fetched html", async () => {
    const orig = globalThis.fetch;
    const result = scoreHtml("https://example.com", goodHtml(), "~500/mo");
    globalThis.fetch = (async () => ({
      ok: true,
      async text() { return JSON.stringify({ ok: true, result }); },
    })) as never;
    try {
      const r = await runAudit("example.com", "~500/mo");
      expect(r.url).toBe("https://example.com");
      expect(r.score).toBe(100);
      expect(r.trafficHint).toBe("~500/mo");
    } finally {
      globalThis.fetch = orig;
    }
  });
});
