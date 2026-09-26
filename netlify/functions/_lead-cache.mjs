import crypto from "node:crypto";
import { supabaseEnabled, supabaseSelect, supabaseUpsert } from "./_supabase.mjs";

export function cleanLeadText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

export function keyify(value) {
  return cleanLeadText(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function makeLeadKey(lead) {
  const stable = [
    keyify(lead.businessName),
    keyify(lead.location),
    cleanLeadText(lead.phone),
    cleanLeadText(lead.sourceUrl),
  ].filter(Boolean).join("|");
  return crypto.createHash("sha256").update(stable || JSON.stringify(lead)).digest("hex");
}

export function matchesLeadFilter(lead, filter) {
  const missing = lead.websiteStatus === "missing";
  const social = lead.websiteStatus === "social-only";
  const hasPhone = !!lead.phone;
  const hasContact = !!lead.phone || !!lead.email;
  if (filter === "missing-website") return missing;
  if (filter === "missing-or-social") return missing || social;
  if (filter === "missing-with-phone") return missing && hasPhone;
  if (filter === "contact-ready") return (missing || social) && hasContact;
  if (filter === "with-phone") return hasPhone && (missing || social);
  return true;
}

export function cacheRowToLead(row) {
  return {
    id: row.lead_key,
    businessName: row.business_name || "",
    niche: row.niche || "",
    location: row.location || "",
    category: row.category || "",
    address: row.address || "",
    phone: row.phone || "",
    email: row.email || "",
    website: row.website || "",
    websiteStatus: row.website_status || "missing",
    leadScore: Number(row.lead_score) || 0,
    priority: row.priority || "C",
    reason: row.reason || "",
    source: row.source || "Lead cache",
    sourceUrl: row.source_url || "",
  };
}

export function leadToCacheRow(lead, defaults = {}) {
  const niche = cleanLeadText(lead.niche || defaults.niche);
  const location = cleanLeadText(lead.location || defaults.location);
  const businessName = cleanLeadText(lead.businessName || lead.business_name || lead.name);
  if (!businessName || !niche || !location) return null;
  const normalized = {
    businessName,
    niche,
    location,
    category: cleanLeadText(lead.category || lead.type || defaults.niche),
    address: cleanLeadText(lead.address || lead.full_address),
    phone: cleanLeadText(lead.phone || lead.phone_number || lead.telephone),
    email: cleanLeadText(lead.email),
    website: cleanLeadText(lead.website || lead.site || lead.url || lead.domain),
    websiteStatus: cleanLeadText(lead.websiteStatus || lead.website_status || "missing"),
    leadScore: Number(lead.leadScore || lead.lead_score || 0),
    priority: cleanLeadText(lead.priority || "C"),
    reason: cleanLeadText(lead.reason),
    source: cleanLeadText(lead.source || defaults.source || "Lead import"),
    sourceUrl: cleanLeadText(lead.sourceUrl || lead.source_url || lead.maps_link || lead.google_maps_url || lead.link),
  };
  const leadKey = cleanLeadText(lead.leadKey || lead.lead_key) || makeLeadKey(normalized);
  return {
    lead_key: leadKey,
    updated_at: new Date().toISOString(),
    source: normalized.source,
    source_url: normalized.sourceUrl,
    niche: normalized.niche,
    niche_key: keyify(normalized.niche),
    location: normalized.location,
    location_key: keyify(normalized.location),
    business_name: normalized.businessName,
    category: normalized.category,
    address: normalized.address,
    phone: normalized.phone,
    email: normalized.email,
    website: normalized.website,
    website_status: normalized.websiteStatus,
    lead_score: normalized.leadScore,
    priority: normalized.priority,
    reason: normalized.reason,
    raw: lead,
  };
}

export async function saveLeadsToCache(leads, defaults = {}) {
  if (!supabaseEnabled()) return { ok: false, skipped: true, saved: 0 };
  const rows = (Array.isArray(leads) ? leads : [])
    .map((lead) => leadToCacheRow(lead, defaults))
    .filter(Boolean);
  if (!rows.length) return { ok: true, saved: 0 };
  await supabaseUpsert("lead_cache", rows, "lead_key");
  return { ok: true, saved: rows.length };
}

export async function getCachedLeads({ niche, location, filter = "all", count = 50 }) {
  if (!supabaseEnabled()) return { ok: false, skipped: true, leads: [] };
  const nicheKey = keyify(niche);
  const locationKey = keyify(location);
  if (!nicheKey || !locationKey) return { ok: true, leads: [] };
  const limit = Math.max(1, Math.min(Number(count) || 50, 500));
  const query = `?select=*&niche_key=eq.${encodeURIComponent(nicheKey)}&location_key=eq.${encodeURIComponent(locationKey)}&order=lead_score.desc&limit=${Math.min(limit * 3, 1000)}`;
  const rows = await supabaseSelect("lead_cache", query).catch(() => ({ data: [] }));
  const leads = (Array.isArray(rows.data) ? rows.data : [])
    .map(cacheRowToLead)
    .filter((lead) => matchesLeadFilter(lead, filter))
    .slice(0, limit);
  return { ok: true, leads };
}
