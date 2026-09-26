import { enforceRateLimits } from "./_gateway.mjs";
import { getCachedLeads, saveLeadsToCache } from "./_lead-cache.mjs";

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

function clean(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return json(405, { ok: false, error: "Method not allowed" });
  }

  try {
    if ((event.body || "").length > 450000) {
      return json(413, { ok: false, error: "Import is too large. Import up to 500 leads or split the file." });
    }

    const gate = await enforceRateLimits(event, [
      { scope: "lead-import", maxRequests: 3, windowSeconds: 120 },
      { scope: "lead-import", maxRequests: 12, windowSeconds: 3600 },
    ]);
    if (!gate.allowed) return gate.response;

    const body = JSON.parse(event.body || "{}");
    const leads = Array.isArray(body.leads) ? body.leads.slice(0, 500) : [];
    const niche = clean(body.niche);
    const location = clean(body.location);
    const filter = clean(body.filter || "all");

    if (!leads.length) return json(400, { ok: false, error: "No leads were provided." });
    if (!niche || !location) return json(400, { ok: false, error: "Niche and location are required." });

    const saved = await saveLeadsToCache(leads, { niche, location, source: "Google Maps import" });
    const cached = await getCachedLeads({ niche, location, filter, count: 500 });

    return json(200, {
      ok: true,
      saved: saved.saved || 0,
      returned: cached.leads.length,
      leads: cached.leads,
      message: `Saved ${saved.saved || 0} leads to shared cache.`,
    });
  } catch (error) {
    return json(500, {
      ok: false,
      error: error instanceof Error ? error.message : "Lead import failed.",
    });
  }
}
