import { supabaseInsert } from "./_supabase.mjs";
import { claimQueueSlot } from "./_queue.mjs";
import { cacheKey, enforceRateLimits, getCachedResponse, setCachedResponse } from "./_gateway.mjs";
import { getCachedLeads, matchesLeadFilter, saveLeadsToCache } from "./_lead-cache.mjs";

const OVERPASS_URLS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.openstreetmap.ru/api/interpreter",
];
const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

const INDIA_BBOX = [6.55, 68.11, 35.67, 97.4];

const NICHE_SELECTORS = {
  "dental clinic": ['["amenity"="dentist"]', '["healthcare"="dentist"]'],
  "medical clinic": ['["amenity"~"clinic|doctors|hospital"]', '["healthcare"~"clinic|doctor|hospital"]'],
  salon: ['["shop"~"hairdresser|beauty"]'],
  gym: ['["leisure"="fitness_centre"]', '["sport"="fitness"]'],
  "coaching institute": ['["amenity"~"school|college|training"]', '["office"="educational_institution"]'],
  restaurant: ['["amenity"~"restaurant|cafe|fast_food"]'],
  hotel: ['["tourism"~"hotel|guest_house|hostel"]'],
  "real estate agency": ['["office"="estate_agent"]'],
  "interior designer": ['["shop"~"furniture|interior_decoration|curtain"]', '["craft"~"interior|carpenter"]'],
  manufacturer: ['["industrial"~"manufacture|factory"]', '["man_made"="works"]'],
  exporter: ['["office"~"company|logistics"]', '["industrial"~"warehouse|factory"]'],
  "travel agency": ['["shop"="travel_agency"]', '["office"="travel_agent"]'],
};

const SOCIAL_HOSTS = [
  "facebook.com",
  "fb.com",
  "instagram.com",
  "linktr.ee",
  "wa.me",
  "whatsapp.com",
  "youtube.com",
  "maps.google.com",
  "goo.gl",
];

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify(body),
  };
}

function clampCount(value) {
  const parsed = Number.parseInt(String(value || ""), 10);
  if (!Number.isFinite(parsed)) return 50;
  return Math.max(1, Math.min(parsed, 500));
}

function cleanText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function compactPhone(value) {
  const raw = cleanText(value);
  if (!raw) return "";
  return raw.replace(/[^\d+,\s-]/g, "").replace(/\s+/g, " ").trim();
}

function normalizeHost(value) {
  try {
    const host = new URL(value.startsWith("http") ? value : `https://${value}`).hostname.toLowerCase();
    return host.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function websiteStatus(website) {
  if (!website) return "missing";
  const host = normalizeHost(website);
  if (SOCIAL_HOSTS.some((d) => host === d || host.endsWith(`.${d}`))) {
    return "social-only";
  }
  return "listed";
}

function leadScore(tags, status) {
  let score = 20;
  const reasons = [];
  if (status === "missing") {
    score += 38;
    reasons.push("no website listed");
  }
  if (status === "social-only") {
    score += 26;
    reasons.push("social-only link");
  }
  if (tags.phone || tags["contact:phone"] || tags.mobile || tags["contact:mobile"]) {
    score += 14;
    reasons.push("public phone available");
  }
  if (tags.email || tags["contact:email"]) {
    score += 12;
    reasons.push("public email available");
  }
  if (tags.opening_hours) {
    score += 6;
    reasons.push("active listing signal");
  }
  if (tags["addr:street"] || tags["addr:full"] || tags["addr:city"]) {
    score += 5;
    reasons.push("address available");
  }
  if (tags.name) {
    score += 10;
    reasons.push("business name available");
  }
  return { score: Math.min(score, 100), reason: reasons.join("; ") || "public business listing" };
}

async function fetchJson(url, init = {}, timeoutMs = 12000) {
  try {
    const res = await fetch(url, {
      ...init,
      signal: AbortSignal.timeout(timeoutMs),
      headers: {
        "User-Agent": "MistHustlers Lead Finder/1.0 (+https://www.misthustlers.in/seo-audit)",
        ...(init.headers || {}),
      },
    });
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return await res.json();
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      throw new Error("request timeout");
    }
    throw error;
  }
}

async function fetchOverpass(query) {
  let lastError = null;
  for (const endpoint of OVERPASS_URLS) {
    try {
      return await fetchJson(
        endpoint,
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
          body: new URLSearchParams({ data: query }).toString(),
        },
        24000
      );
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error("All lead data endpoints failed.");
}

async function geocode(location) {
  const url = new URL(NOMINATIM_URL);
  url.searchParams.set("q", `${location}, India`);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("limit", "1");
  url.searchParams.set("countrycodes", "in");
  const data = await fetchJson(url, {}, 9000);
  const first = Array.isArray(data) ? data[0] : null;
  if (!first?.boundingbox) {
    throw new Error("Location was not found. Use a city and state, for example: Indore, Madhya Pradesh.");
  }
  const [south, north, west, east] = first.boundingbox.map(Number);
  let bbox = [south, west, north, east];
  if (![south, west, north, east].every(Number.isFinite)) return INDIA_BBOX;
  const lat = Number(first.lat);
  const lon = Number(first.lon);
  const latSpan = Math.abs(north - south);
  const lonSpan = Math.abs(east - west);
  if (Number.isFinite(lat) && Number.isFinite(lon) && (latSpan > 0.9 || lonSpan > 0.9)) {
    const radius = 0.28;
    bbox = [lat - radius, lon - radius, lat + radius, lon + radius];
  }
  return bbox;
}

function buildQuery({ niche, bbox, maxResults }) {
  const selectors = NICHE_SELECTORS[niche] || ['["name"]'];
  const [south, west, north, east] = bbox;
  const parts = selectors.map((selector) => `nwr${selector}(${south},${west},${north},${east});`);
  return `[out:json][timeout:22];(${parts.join("")});out center tags ${Math.min(maxResults * 4, 1600)};`;
}

function pickWebsite(tags) {
  return cleanText(tags.website || tags["contact:website"] || tags.url || tags["brand:website"] || tags["operator:website"] || "");
}

function pickEmail(tags) {
  return cleanText(tags.email || tags["contact:email"] || tags["operator:email"] || "");
}

function pickPhone(tags) {
  return compactPhone(tags.phone || tags["contact:phone"] || tags.mobile || tags["contact:mobile"] || tags["operator:phone"] || "");
}

function fullAddress(tags) {
  const full = cleanText(tags["addr:full"]);
  if (full) return full;
  return cleanText([
    tags["addr:housenumber"],
    tags["addr:street"],
    tags["addr:suburb"],
    tags["addr:city"],
    tags["addr:state"],
    tags["addr:postcode"],
  ].filter(Boolean).join(", "));
}

function mapLead(element, niche, location) {
  const tags = element.tags || {};
  const website = pickWebsite(tags);
  const status = websiteStatus(website);
  const scored = leadScore(tags, status);
  const lat = element.lat ?? element.center?.lat ?? "";
  const lon = element.lon ?? element.center?.lon ?? "";
  const mapsUrl = lat && lon ? `https://www.google.com/maps/search/?api=1&query=${lat},${lon}` : "";
  return {
    id: `${element.type}-${element.id}`,
    businessName: cleanText(tags.name || "Unnamed business"),
    niche,
    location,
    category: cleanText(tags.amenity || tags.shop || tags.office || tags.tourism || tags.healthcare || tags.industrial || tags.craft || "business"),
    address: fullAddress(tags),
    phone: pickPhone(tags),
    email: pickEmail(tags),
    website,
    websiteStatus: status,
    leadScore: scored.score,
    priority: scored.score >= 70 ? "A" : scored.score >= 50 ? "B" : "C",
    reason: scored.reason,
    source: "OpenStreetMap",
    sourceUrl: mapsUrl,
  };
}

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return json(405, { ok: false, error: "Method not allowed" });
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const niche = cleanText(body.niche).toLowerCase();
    const location = cleanText(body.location);
    const filter = cleanText(body.filter || "missing-website");
    const maxResults = clampCount(body.count);

    if (!niche || !location) {
      return json(400, { ok: false, error: "Niche and location are required." });
    }

    const gate = await enforceRateLimits(event, [
      { scope: "lead-finder", maxRequests: 3, windowSeconds: 120 },
      { scope: "lead-finder", maxRequests: 20, windowSeconds: 3600 },
    ]);
    if (!gate.allowed) return gate.response;

    const key = cacheKey("lead-finder", { niche, location: location.toLowerCase(), filter, maxResults });
    const cached = await getCachedResponse(key);
    if (cached.hit) {
      return json(200, { ...cached.value, cached: true, cacheSource: cached.source });
    }

    const databaseCache = await getCachedLeads({ niche, location, filter, count: maxResults });
    if (databaseCache.leads.length >= Math.min(maxResults, 25)) {
      return json(200, {
        ok: true,
        queued: false,
        cached: true,
        cacheSource: "lead_cache",
        mode: "database-cache",
        requested: maxResults,
        returned: databaseCache.leads.length,
        savedToDatabase: true,
        leadSourceNote: "Returned from saved lead cache. No scraper/data-source request was needed for this search.",
        leads: databaseCache.leads.slice(0, maxResults),
      });
    }

    const slot = await claimQueueSlot("lead-finder", { maxActive: 3, ttlSeconds: 90 });
    if (!slot.allowed) return json(slot.statusCode, slot.body);

    try {
      const bbox = await geocode(location);
      const query = buildQuery({ niche, bbox, maxResults });
      const overpass = await fetchOverpass(query);

      const seen = new Set();
      const all = (overpass.elements || [])
        .map((element) => mapLead(element, niche, location))
        .filter((lead) => {
          if (!lead.businessName || lead.businessName === "Unnamed business") return false;
          const key = `${lead.businessName.toLowerCase()}|${lead.address.toLowerCase()}|${lead.phone}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return matchesLeadFilter(lead, filter);
        })
        .sort((a, b) => b.leadScore - a.leadScore || a.businessName.localeCompare(b.businessName))
        .slice(0, maxResults);

      const combined = [
        ...databaseCache.leads,
        ...all.filter((lead) => !databaseCache.leads.some((cachedLead) => cachedLead.id === lead.id || (cachedLead.businessName.toLowerCase() === lead.businessName.toLowerCase() && cachedLead.phone === lead.phone))),
      ].sort((a, b) => b.leadScore - a.leadScore || a.businessName.localeCompare(b.businessName)).slice(0, maxResults);

      let savedToDatabase = false;
      let databaseError = "";
      try {
        await saveLeadsToCache(all, { niche, location, source: "OpenStreetMap" });
        const saved = await supabaseInsert("lead_search_runs", {
          niche,
          location,
          filter,
          requested_count: maxResults,
          returned_count: combined.length,
          source: "OpenStreetMap",
          leads: combined,
        });
        savedToDatabase = !!saved.ok;
      } catch (error) {
        databaseError = error instanceof Error ? error.message : "Database save failed.";
      }

      const response = {
        ok: true,
        queued: false,
        cached: false,
        mode: "public-map-data",
        requested: maxResults,
        returned: combined.length,
        savedToDatabase,
        databaseError,
        leadSourceNote: databaseCache.leads.length
          ? `Merged ${databaseCache.leads.length} saved leads with fresh public map data. Future users can reuse this cache.`
          : "Uses public OpenStreetMap business data and saves results to the lead cache for future users.",
        leads: combined,
      };
      await setCachedResponse(key, response, 43200);
      await slot.release("completed");
      return json(200, response);
    } catch (error) {
      await slot.release("failed");
      throw error;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Lead search failed.";
    if (/fetch failed|Request failed: 5|timeout|abort/i.test(message)) {
      return json(202, {
        ok: false,
        queued: true,
        jobType: "lead-finder",
        position: 1,
        retryAfterSeconds: 45,
        message: "Lead data source is busy. Retrying shortly.",
      });
    }
    return json(500, {
      ok: false,
      error: message,
    });
  }
}
