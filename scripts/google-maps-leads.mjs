import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";

const args = process.argv.slice(2);

function readArg(name, fallback = "") {
  const long = `--${name}`;
  const idx = args.indexOf(long);
  if (idx >= 0 && args[idx + 1]) return args[idx + 1];
  const prefixed = args.find((arg) => arg.startsWith(`${long}=`));
  if (prefixed) return prefixed.slice(long.length + 1);
  return fallback;
}

function hasFlag(name) {
  return args.includes(`--${name}`);
}

function slugify(value) {
  return String(value || "google-maps-leads")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "google-maps-leads";
}

function csvCell(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function normalizeWebsite(value) {
  const cleaned = String(value || "").trim().replace(/[),.;]+$/g, "");
  if (!cleaned) return "";
  if (/^https?:\/\//i.test(cleaned)) return cleaned;
  if (/^[a-z0-9.-]+\.[a-z]{2,}(\/\S*)?$/i.test(cleaned)) return `https://${cleaned}`;
  return "";
}

function websiteStatus(website) {
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

function leadScore(lead) {
  let score = 22;
  if (lead.websiteStatus === "missing") score += 40;
  if (lead.websiteStatus === "social-only") score += 28;
  if (lead.phone) score += 16;
  if (lead.email) score += 12;
  if (lead.address) score += 6;
  if (lead.businessName) score += 8;
  return Math.min(100, score);
}

function normalizeLead(row, index, { niche, location, query }) {
  const website = normalizeWebsite(row.website || row.site || row.url || row.domain || "");
  const status = websiteStatus(website);
  const phone = String(row.phone || row.phone_number || row.telephone || "").trim();
  const email = String(row.email || "").trim();
  const address = String(row.address || row.full_address || row.location || "").trim();
  const businessName = String(row.name || row.title || row.businessName || row.business_name || `Google Maps lead ${index + 1}`).trim();
  const partial = { websiteStatus: status, phone, email, address, businessName };
  const score = leadScore(partial);
  const rating = row.rating ? `rating ${row.rating}` : "";
  const reviews = row.reviews_count || row.reviews ? `${row.reviews_count || row.reviews} reviews` : "";
  return {
    id: `google-maps-${Date.now()}-${index}`,
    businessName,
    niche: niche || query,
    location,
    category: String(row.category || row.type || niche || "business").trim(),
    address,
    phone,
    email,
    website,
    websiteStatus: status,
    leadScore: score,
    priority: score >= 70 ? "A" : score >= 50 ? "B" : "C",
    reason: [status === "missing" ? "no website in Google Maps result" : status === "social-only" ? "social-only link in result" : "website listed", phone ? "phone available" : "", address ? "address available" : "", rating, reviews].filter(Boolean).join("; "),
    source: "Google Maps local scraper",
    sourceUrl: String(row.maps_link || row.google_maps_url || row.link || row.url || `https://www.google.com/maps/search/${encodeURIComponent(businessName + " " + location)}`).trim(),
  };
}

function toCsv(leads) {
  const headers = ["businessName", "niche", "location", "category", "address", "phone", "email", "website", "websiteStatus", "leadScore", "priority", "reason", "source", "sourceUrl"];
  return [headers.join(","), ...leads.map((lead) => headers.map((key) => csvCell(lead[key])).join(","))].join("\n");
}

function run(command, commandArgs) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, commandArgs, { stdio: "inherit", shell: process.platform === "win32" });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} exited with code ${code}`));
    });
    child.on("error", reject);
  });
}

async function main() {
  const query = readArg("query") || readArg("q");
  const niche = readArg("niche");
  const location = readArg("location");
  const count = Math.max(1, Math.min(Number.parseInt(readArg("count", "100"), 10) || 100, 500));
  const maxScrolls = Math.max(5, Math.min(Number.parseInt(readArg("max-scrolls", "80"), 10) || 80, 250));
  const outDir = readArg("out-dir", "tmp-qa/google-maps-leads");
  const headless = hasFlag("headless") || readArg("headless", "true") !== "false";

  if (!query) {
    console.error('Usage: npm run leads:google -- --query "dental clinic in Indore" --count 100 --headless');
    process.exit(1);
  }

  await fs.mkdir(outDir, { recursive: true });
  const base = `${slugify(query)}-${Date.now()}`;
  const rawPath = path.join(outDir, `${base}.raw.json`);
  const jsonPath = path.join(outDir, `${base}.leads.json`);
  const csvPath = path.join(outDir, `${base}.leads.csv`);

  console.log(`[google-leads] Running local Google Maps scraper for: ${query}`);
  console.log("[google-leads] This runs on your computer, not Netlify. If Google shows captcha/no results, retry visible mode with --headless=false.");

  const npxArgs = ["-y", "gmaps-scraper", "scrape", "-q", query, "-o", rawPath, "-m", String(maxScrolls)];
  if (headless) npxArgs.push("--headless");
  await run("npx", npxArgs);

  if (!existsSync(rawPath)) {
    throw new Error(`Scraper did not create ${rawPath}`);
  }

  const raw = JSON.parse(await fs.readFile(rawPath, "utf8"));
  const rows = Array.isArray(raw) ? raw : Array.isArray(raw.results) ? raw.results : Array.isArray(raw.businesses) ? raw.businesses : [];
  const leads = rows
    .map((row, index) => normalizeLead(row, index, { niche, location, query }))
    .sort((a, b) => b.leadScore - a.leadScore || a.businessName.localeCompare(b.businessName))
    .slice(0, count);

  await fs.writeFile(jsonPath, JSON.stringify(leads, null, 2));
  await fs.writeFile(csvPath, toCsv(leads));

  console.log(`[google-leads] Saved ${leads.length} normalized leads:`);
  console.log(`  JSON: ${jsonPath}`);
  console.log(`  CSV:  ${csvPath}`);
  console.log("[google-leads] Open JSON and paste it into Lead Hunter's Google Maps Import box.");
}

main().catch((error) => {
  console.error(`[google-leads] ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
