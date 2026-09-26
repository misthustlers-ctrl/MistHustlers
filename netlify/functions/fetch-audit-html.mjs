import { requireSupabaseUser } from "./_supabase.mjs";

const MAX_HTML_CHARS = 750000;
const BLOCKED_HOSTS = new Set(["localhost", "127.0.0.1", "0.0.0.0", "::1"]);

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return json(405, { ok: false, error: "METHOD_NOT_ALLOWED" });
  }

  const auth = await requireSupabaseUser(event);
  if (!auth.ok) return json(auth.statusCode, auth.body);

  let targetUrl;
  try {
    const body = JSON.parse(event.body || "{}");
    targetUrl = normalizeUrl(body.url);
  } catch {
    return json(400, { ok: false, error: "BAD_REQUEST" });
  }

  if (!targetUrl) {
    return json(400, { ok: false, error: "INVALID_URL" });
  }

  try {
    const response = await fetch(targetUrl, {
      redirect: "follow",
      headers: {
        "User-Agent": "MistHustlers SEO Audit Bot/1.0 (+https://www.misthustlers.in/seo-audit)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      signal: AbortSignal.timeout(25000),
    });

    if (!response.ok) {
      return json(502, { ok: false, error: `SITE_HTTP_${response.status}` });
    }

    const contentType = response.headers.get("content-type") || "";
    if (contentType && !/text\/html|application\/xhtml\+xml|application\/xml/i.test(contentType)) {
      return json(415, { ok: false, error: "NOT_HTML" });
    }

    const html = (await response.text()).slice(0, MAX_HTML_CHARS);
    if (html.length >= 120) {
      return json(200, { ok: true, url: targetUrl, html, mode: "fetch" });
    }

    const renderedHtml = await fetchWithBrowser(targetUrl);
    return json(200, { ok: true, url: targetUrl, html: renderedHtml, mode: "browser" });
  } catch (err) {
    try {
      const renderedHtml = await fetchWithBrowser(targetUrl);
      return json(200, { ok: true, url: targetUrl, html: renderedHtml, mode: "browser" });
    } catch (browserErr) {
      const message = browserErr instanceof Error ? browserErr.message : err instanceof Error ? err.message : "FETCH_FAILED";
      return json(504, { ok: false, error: message.includes("timeout") ? "TIMEOUT" : "FETCH_FAILED" });
    }
  }
};

async function fetchWithBrowser(targetUrl) {
  if (typeof process === "undefined") {
    throw new Error("BROWSER_RENDER_UNAVAILABLE");
  }
  const moduleName = "playwright";
  const { chromium } = await import(moduleName);
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  try {
    const page = await browser.newPage({
      userAgent: "MistHustlers SEO Audit Browser/1.0 (+https://www.misthustlers.in/seo-audit)",
      viewport: { width: 1366, height: 900 },
    });
    await page.goto(targetUrl, { waitUntil: "domcontentloaded", timeout: 28000 });
    await page.waitForLoadState("networkidle", { timeout: 6000 }).catch(() => {});
    const html = (await page.content()).slice(0, MAX_HTML_CHARS);
    if (html.length < 120) throw new Error("EMPTY_PAGE");
    return html;
  } finally {
    await browser.close();
  }
}

function normalizeUrl(input) {
  let value = String(input || "").trim();
  if (!value) return "";
  if (!/^https?:\/\//i.test(value)) value = `https://${value}`;

  try {
    const parsed = new URL(value);
    if (!["http:", "https:"].includes(parsed.protocol)) return "";
    const hostname = parsed.hostname.toLowerCase();
    if (BLOCKED_HOSTS.has(hostname) || hostname.endsWith(".local") || hostname.endsWith(".internal")) return "";
    if (/^10\./.test(hostname) || /^192\.168\./.test(hostname) || /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname)) return "";
    return parsed.toString();
  } catch {
    return "";
  }
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}
