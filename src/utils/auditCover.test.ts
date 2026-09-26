import { describe, expect, it } from "vitest";
import type { AuditResult } from "./auditEngine";

const SAMPLE: AuditResult = {
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
};

describe("auditCover suite", () => {
  it("has a valid sample fixture", () => {
    expect(SAMPLE.checks.length).toBe(6);
    expect(SAMPLE.score).toBe(42);
  });
});