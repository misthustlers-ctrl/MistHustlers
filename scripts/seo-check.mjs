import { readFileSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ROUTES, routeKeyForPath } from "./routes.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, "../dist/__prerendered");

const DEFAULT_URL = "https://www.misthustlers.in/";
const bright = (t) => `\x1b[1m${t}\x1b[0m`;
const green = (t) => `\x1b[32m${t}\x1b[0m`;
const red = (t) => `\x1b[31m${t}\x1b[0m`;
const yellow = (t) => `\x1b[33m${t}\x1b[0m`;
const dim = (t) => `\x1b[2m${t}\x1b[0m`;

function parseArgs() {
  const input = process.argv.slice(2).find((a) => !a.startsWith("--"));
  return {
    url: input || DEFAULT_URL,
    live: process.argv.includes("--live"),
  };
}

function normalizeUrl(raw) {
  const url = new URL(raw.toLowerCase().startsWith("//") ? `https:${raw}` : raw);
  url.hash = "";
  return url;
}

async function resolveHtml(url, useLive) {
  if (!useLive) {
    let key = null;
    try {
      key = routeKeyForPath(url.pathname.endsWith("/") ? url.pathname.slice(0, -1) || "/" : url.pathname);
    } catch {
      key = "index.html";
    }
    const candidate = path.join(DIST, key);
    if (existsSync(candidate)) {
      return { source: `local prerender (${key})`, local: true, html: readFileSync(candidate, "utf-8") };
    }
  }
  if (url.protocol === "http:" || url.protocol === "https:") {
    const response = await fetch(url.toString(), { redirect: "follow", signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error(`GET ${url} -> HTTP ${response.status}`);
    return { source: `live fetch (HTTP ${response.status})`, local: false, html: await response.text() };
  }
  throw new Error("No local prerendered file found and network fetch disabled.");
}

async function fetchText(baseUrl, suffix) {
  const response = await fetch(`${baseUrl}${suffix}`, { redirect: "follow", signal: AbortSignal.timeout(4000) });
  if (!response.ok) return null;
  return response.text();
}

function extract(re, html) {
  const m = html.match(re);
  return m ? m[1].trim() : null;
}
function extractAll(re, html) {
  return [...html.matchAll(new RegExp(re, "gi"))].map((m) => m[1].trim()).filter(Boolean);
}
function decodeEntities(s) {
  return String(s).replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}

function stripTrailingSlash(value) {
  const s = String(value || "");
  return s.length > 1 && s.endsWith("/") ? s.slice(0, -1) : s;
}

function textContent(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function relPath(url) {
  const p = url.pathname === "/" ? "/" : url.pathname.replace(/\/$/, "");
  return p;
}

function runChecks(html, url, loaders) {
  const checks = [];

  const title = extract(/<title[^>]*>(.*?)<\/title>/is, html);
  checks.push({
    label: "TITLE",
    passed: !!title && title.length > 10 && title.length <= 75,
    detail: title ? `${title.slice(0, 80)} (${title.length} chars)` : "missing",
    exact: title,
  });

  const descTag = html.match(/<meta[^>]+name=["']description["'][^>]*>/i)?.[0] || "";
  const desc = descTag.match(/content="([^"]*)"/)?.[1] || null;
  checks.push({
    label: "META DESCRIPTION",
    passed: !!desc && desc.length >= 50,
    detail: desc ? `${desc.slice(0, 100)}… (${desc.length} chars)` : "missing",
    exact: desc,
  });

  const h1s = [...html.matchAll(/<h1[\s>]/gi)].length;
  checks.push({
    label: "H1",
    passed: h1s === 1,
    detail: `${h1s} H1 found (ideal: exactly 1)`,
  });

  const canonicals = [...html.matchAll(/rel=["']canonical["'][^>]*href=["']([^"']+)["']/gi)].map((m) => m[1]);
  checks.push({
    label: "CANONICAL",
    passed: canonicals.length === 1 && stripTrailingSlash(canonicals[0]) === stripTrailingSlash(url.toString()),
    detail: canonicals.length ? `found ${canonicals.length}: ${canonicals[0]}` : "missing",
  });

  const ogUrl = extract(/property=["']og:url["'][^>]*content=["']([^"']*)["']/i, html);
  const ogTitle = extract(/property=["']og:title["'][^>]*content=["']([^"']*)["']/i, html);
  const ogDesc = extract(/property=["']og:description["'][^>]*content=["']([^"']*)["']/i, html);
  const ogImage = extract(/property=["']og:image["'][^>]*content=["']([^"']*)["']/i, html);
  checks.push({
    label: "OPENGRAPH",
    passed: !!(ogUrl && ogTitle && ogDesc && ogImage),
    detail: `url=${ogUrl ? "✓" : "✗"} title=${ogTitle ? "✓" : "✗"} desc=${ogDesc ? "✓" : "✗"} image=${ogImage ? "✓" : "✗"}`,
  });

  const twitterCard = extract(/name=["']twitter:card["'][^>]*content=["']([^"']*)["']/i, html);
  checks.push({
    label: "TWITTER CARD",
    passed: !!twitterCard,
    detail: twitterCard || "missing",
  });

  const jsonLdScripts = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  let schemaValid = false;
  let schemaCount = 0;
  if (jsonLdScripts.length) {
    schemaCount = jsonLdScripts.length;
    try {
      JSON.parse(jsonLdScripts[0][1]);
      schemaValid = true;
    } catch {
      schemaValid = false;
    }
  }
  checks.push({
    label: "JSON-LD SCHEMA",
    passed: schemaValid && schemaCount > 0,
    detail: `${schemaCount} script(s), ${schemaValid ? "valid JSON" : "INVALID JSON"}`,
  });

  const images = [...html.matchAll(/<img[^>]*>/gi)].map((tag) => tag[0]);
  const imgs = images.length;
  const noAlt = images.filter((t) => !/alt=/i.test(t)).length;
  checks.push({
    label: "IMAGE ALT",
    passed: imgs === 0 || noAlt === 0,
    detail: `${imgs - noAlt}/${imgs} images have alt (${noAlt} missing)`,
  });

  const headings = [...html.matchAll(/<h([1-6])[\s>]/gi)].map((m) => Number(m[1]));
  const h1Index = headings.indexOf(1);
  checks.push({
    label: "HEADING HIERARCHY",
    passed: h1Index !== -1,
    detail: `h1=${headings.filter((h) => h === 1).length}, h2=${headings.filter((h) => h === 2).length}, h3=${headings.filter((h) => h === 3).length}`,
  });

  const viewport = extract(/name=["']viewport["'][^>]*content=["']([^"']*)["']/i, html);
  checks.push({ label: "VIEWPORT", passed: !!viewport && /width=device-width/.test(viewport || ""), detail: viewport || "missing" });

  const langAttr = extract(/<html[^>]*lang=["']([^"']*)["']/i, html);
  checks.push({ label: "HTML LANG", passed: !!langAttr, detail: langAttr || "missing" });

  const bodyLen = textContent(html).length;
  checks.push({ label: "BODY CONTENT", passed: bodyLen > 200, detail: `${bodyLen} chars of body text`, words: bodyLen });

  return checks;
}

async function main() {
  const { url: rawUrl, live } = parseArgs();
  let url;
  try {
    url = new URL(rawUrl);
    if (!/^https?:$/.test(url.protocol)) throw new Error("bad");
  } catch {
    console.error(red("❌ Invalid URL: ") + rawUrl);
    process.exit(2);
  }

  let html;
  let sourceText;
  let localMode;
  try {
    ({ html, source: sourceText, local: localMode } = await resolveHtml(url, live));
  } catch (err) {
    console.error(red("❌ ") + err.message);
    process.exit(2);
  }

  const origin = url.origin;
  let robots = null;
  let sitemap = "";
  if (localMode) {
    try {
      const distDir = DIST;
      sitemap = existsSync(path.join(distDir, "../sitemap.xml")) ? readFileSync(path.join(distDir, "../sitemap.xml"), "utf-8") : "";
      robots = existsSync(path.join(distDir, "../robots.txt")) ? readFileSync(path.join(distDir, "../robots.txt"), "utf-8") : null;
    } catch {
      robots = null;
    }
  } else {
    robots = await fetchText(origin, "/robots.txt").catch(() => null);
    sitemap = (await fetchText(origin, "/sitemap.xml").catch(() => null)) || "";
  }

  console.log("");
  console.log(bright(`${green("◉ SEO CHECK REPORT")} ${dim("·")} ${sourceText}`));
  console.log(dim(url.toString()));
  console.log(dim("──────────────────────────────────────────────"));

  const checks = runChecks(html, url);
  let total = 0;
  for (const c of checks) {
    total += c.passed ? 1 : 0;
    const mark = c.passed ? green("✓ PASS") : red("✗ FAIL");
    console.log(`  ${mark}  ${bright(c.label.padEnd(20))} ${c.detail || "—"}`);
  }

  const sitemapHit = sitemap.includes(url.toString());
  console.log(`  ${sitemapHit ? green("✓ PASS") : red("✗ FAIL")}  ${bright("SITEMAP".padEnd(20))} ${url.toString()} ${sitemapHit ? "present" : "NOT in sitemap.xml"}`);
  total += sitemapHit ? 1 : 0;

  const robotsOk = !!robots && /allow/i.test(robots);
  console.log(`  ${robotsOk ? green("✓ PASS") : yellow("? WARN")}  ${bright("ROBOTS.TXT".padEnd(20))} ${robots ? "reachable" : "not reachable (check hosting)"}`);
  total += robotsOk ? 1 : 0;

  const pct = Math.round((total / (checks.length + 2)) * 100);
  console.log("");
  console.log(`${green(bright("✓ Total SEO score"))} : ${pct}%  (${total}/${checks.length + 2} checks passing)`);
  console.log(`${dim(`Tip: run   npm run seo-check -- https://www.misthustlers.in<path>  for any page`)}`);
  console.log(`${dim(`Or test the LIVE production URL with:  -- --live`)}`);
}

main().catch((err) => {
  console.error(red("✗ ") + err.message);
  process.exit(1);
});