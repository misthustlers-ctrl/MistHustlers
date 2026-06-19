import { readFileSync, existsSync } from "fs";
import { resolve, join } from "path";

const PRERENDERED = resolve("dist", "__prerendered");

const ROUTES = [
  { file: "index.html", route: "/", label: "Home" },
  { file: "services.html", route: "/services", label: "Services" },
  { file: "services-web-development.html", route: "/services/web-development", label: "Web Development" },
  { file: "services-automation.html", route: "/services/automation", label: "Automation" },
  { file: "services-mvp-development.html", route: "/services/mvp-development", label: "MVP Development" },
  { file: "career.html", route: "/career", label: "Career" },
  { file: "projects.html", route: "/projects", label: "Projects" },
  { file: "about.html", route: "/about", label: "About" },
  { file: "contact.html", route: "/contact", label: "Contact" },
  { file: "faq.html", route: "/faq", label: "FAQ" },
  { file: "privacy-policy.html", route: "/privacy-policy", label: "Privacy Policy" },
  { file: "terms-of-service.html", route: "/terms-of-service", label: "Terms of Service" },
  { file: "refund-policy.html", route: "/refund-policy", label: "Refund Policy" },
];

function check(label, passed, detail = "") {
  const mark = passed ? "PASS" : "FAIL";
  return `  [${mark}] ${label}${detail ? ": " + detail : ""}`;
}

function extract(html, regex) {
  const m = html.match(regex);
  return m ? m[1].trim() : null;
}

function textFromHtml(value) {
  return value ? value.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim() : null;
}

let allPassed = 0;
let allFailed = 0;

console.log("=".repeat(60));
console.log("SEO Verification Report");
console.log("=".repeat(60));

for (const { file, route, label } of ROUTES) {
  const filePath = join(PRERENDERED, file);
  console.log(`\n--- ${label} (${route}) ---`);

  if (!existsSync(filePath)) {
    console.log(`  [FAIL] File not found: ${filePath}`);
    allFailed++;
    continue;
  }

  const html = readFileSync(filePath, "utf-8");
  let passed = 0;
  let failed = 0;

  const hasTitle = html.includes("<title>") && !html.includes("<title></title>");
  const title = extract(html, /<title>([^<]+)<\/title>/i);

  const hasDescription = html.includes('name="description"');
  const desc = extract(html, /<meta\s+name="description"[^>]*content="([^"]+)"/i);

  const h1 = textFromHtml(extract(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i));
  const hasH1 = Boolean(h1);

  const hasCanonical = html.includes('rel="canonical"');
  const canonical = extract(html, /rel="canonical"[^>]*href="([^"]+)"/i);
  const canonicalCount = (html.match(/rel="canonical"/g) || []).length;
  const hasCorrectCanonical = canonical === `https://www.misthustlers.in${route === "/" ? "" : route}`;
  const hasOgUrl = html.includes(`property="og:url" content="https://www.misthustlers.in${route === "/" ? "" : route}"`);
  const hasOldDomain = /misthustlers\.up\.railway\.app|misthustlers\.com|https:\/\/misthustlers\.in/i.test(html);

  const hasSchemaLD = html.includes('application/ld+json');
  const hasSchemaOrg = html.includes('"@type"');

  const bodyContent = html.replace(/<[^>]*>/g, "").trim();
  const hasContent = bodyContent.length > 200;

  const hasRootMount = html.includes('id="root"');

  console.log(check("Title exists", hasTitle, title || ""));
  if (hasTitle) passed++; else failed++;
  console.log(check("Meta description", hasDescription, desc ? desc.substring(0, 80) + "..." : ""));
  if (hasDescription) passed++; else failed++;
  console.log(check("H1 heading", hasH1, h1 || ""));
  if (hasH1) passed++; else failed++;
  console.log(check("Canonical URL", hasCanonical, canonical || ""));
  if (hasCanonical) passed++; else failed++;
  console.log(check("Single canonical", canonicalCount === 1, `${canonicalCount}`));
  if (canonicalCount === 1) passed++; else failed++;
  console.log(check("Canonical is www self-reference", hasCorrectCanonical, canonical || ""));
  if (hasCorrectCanonical) passed++; else failed++;
  console.log(check("OG URL is www self-reference", hasOgUrl, ""));
  if (hasOgUrl) passed++; else failed++;
  console.log(check("No old public domains", !hasOldDomain, ""));
  if (!hasOldDomain) passed++; else failed++;
  console.log(check("JSON-LD schema", hasSchemaLD && hasSchemaOrg, ""));
  if (hasSchemaLD && hasSchemaOrg) passed++; else failed++;
  console.log(check("Has body content (>200 chars)", hasContent, `${bodyContent.length} chars`));
  if (hasContent) passed++; else failed++;
  console.log(check("Has root mount div", hasRootMount, ""));
  if (hasRootMount) passed++; else failed++;

  const total = passed + failed;
  const pct = Math.round((passed / total) * 100);
  console.log(`  Result: ${passed}/${total} (${pct}%)`);
  if (pct >= 85) {
    console.log(`  Verdict: PASS`);
    allPassed++;
  } else {
    console.log(`  Verdict: FAIL`);
    allFailed++;
  }
}

console.log("\n" + "=".repeat(60));
console.log(`Overall: ${allPassed}/${allPassed + allFailed} routes passed`);
if (allFailed === 0) {
  console.log("FINAL VERDICT: PASS");
} else {
  console.log(`FINAL VERDICT: PARTIAL (${allFailed} route(s) failed)`);
}
console.log("=".repeat(60));
