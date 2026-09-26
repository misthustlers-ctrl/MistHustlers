import crypto from "node:crypto";
import { supabaseEnabled, supabaseInsert, supabaseSelect, supabaseUpsert } from "./_supabase.mjs";

const memoryEvents = new Map();
const memoryCache = new Map();

export function gatewayJson(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify(body),
  };
}

export function getClientIp(event) {
  const headers = event.headers || {};
  return (
    headers["cf-connecting-ip"] ||
    headers["x-nf-client-connection-ip"] ||
    headers["client-ip"] ||
    headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    headers["X-Forwarded-For"]?.split(",")[0]?.trim() ||
    "unknown"
  );
}

export function cacheKey(scope, payload) {
  return crypto
    .createHash("sha256")
    .update(`${scope}:${JSON.stringify(payload)}`)
    .digest("hex");
}

function iso(offsetSeconds = 0) {
  return new Date(Date.now() + offsetSeconds * 1000).toISOString();
}

export async function enforceRateLimit(event, {
  scope,
  maxRequests = 10,
  windowSeconds = 60,
} = {}) {
  const ip = getClientIp(event);
  const since = Date.now() - windowSeconds * 1000;

  if (!supabaseEnabled()) {
    const key = `${scope}:${ip}`;
    const events = (memoryEvents.get(key) || []).filter((t) => t > since);
    if (events.length >= maxRequests) {
      const oldest = Math.min(...events);
      const retryAfterSeconds = Math.max(5, Math.ceil((oldest + windowSeconds * 1000 - Date.now()) / 1000));
      return {
        allowed: false,
        response: gatewayJson(429, {
          ok: false,
          rateLimited: true,
          retryAfterSeconds,
          message: `Too many ${scope} requests. Retry after ${retryAfterSeconds} seconds.`,
        }),
      };
    }
    events.push(Date.now());
    memoryEvents.set(key, events);
    return { allowed: true, ip };
  }

  const query = `?select=id&scope=eq.${encodeURIComponent(scope)}&client_ip=eq.${encodeURIComponent(ip)}&created_at=gt.${encodeURIComponent(iso(-windowSeconds))}`;
  const existing = await supabaseSelect("api_gateway_events", query);
  const count = Array.isArray(existing.data) ? existing.data.length : 0;
  if (count >= maxRequests) {
    return {
      allowed: false,
      response: gatewayJson(429, {
        ok: false,
        rateLimited: true,
        retryAfterSeconds: windowSeconds,
        message: `Too many ${scope} requests. Retry after ${windowSeconds} seconds.`,
      }),
    };
  }
  await supabaseInsert("api_gateway_events", { scope, client_ip: ip }).catch(() => null);
  return { allowed: true, ip };
}

export async function enforceRateLimits(event, rules = []) {
  const validRules = (Array.isArray(rules) ? rules : []).filter((rule) => rule?.scope);
  if (!validRules.length) return { allowed: true, ip: getClientIp(event) };

  const ip = getClientIp(event);
  const normalizedRules = ip === "unknown"
    ? validRules.map((rule) => ({
        ...rule,
        maxRequests: Math.min(Number(rule.maxRequests) || 2, 2),
        windowSeconds: Number(rule.windowSeconds) || 60,
      }))
    : validRules;

  if (!supabaseEnabled()) {
    for (const rule of normalizedRules) {
      const scope = rule.scope;
      const maxRequests = Number(rule.maxRequests) || 10;
      const windowSeconds = Number(rule.windowSeconds) || 60;
      const since = Date.now() - windowSeconds * 1000;
      const key = `${scope}:${ip}`;
      const events = (memoryEvents.get(key) || []).filter((t) => t > since);
      if (events.length >= maxRequests) {
        const oldest = Math.min(...events);
        const retryAfterSeconds = Math.max(5, Math.ceil((oldest + windowSeconds * 1000 - Date.now()) / 1000));
        return {
          allowed: false,
          response: gatewayJson(429, {
            ok: false,
            rateLimited: true,
            retryAfterSeconds,
            message: `Too many ${scope} requests. Retry after ${retryAfterSeconds} seconds.`,
          }),
        };
      }
    }
    for (const scope of [...new Set(normalizedRules.map((rule) => rule.scope))]) {
      const key = `${scope}:${ip}`;
      const events = memoryEvents.get(key) || [];
      events.push(Date.now());
      memoryEvents.set(key, events);
    }
    return { allowed: true, ip };
  }

  for (const rule of normalizedRules) {
    const scope = rule.scope;
    const maxRequests = Number(rule.maxRequests) || 10;
    const windowSeconds = Number(rule.windowSeconds) || 60;
    const query = `?select=id&scope=eq.${encodeURIComponent(scope)}&client_ip=eq.${encodeURIComponent(ip)}&created_at=gt.${encodeURIComponent(iso(-windowSeconds))}&limit=${maxRequests + 1}`;
    const existing = await supabaseSelect("api_gateway_events", query);
    const count = Array.isArray(existing.data) ? existing.data.length : 0;
    if (count >= maxRequests) {
      return {
        allowed: false,
        response: gatewayJson(429, {
          ok: false,
          rateLimited: true,
          retryAfterSeconds: windowSeconds,
          message: `Too many ${scope} requests. Retry after ${windowSeconds} seconds.`,
        }),
      };
    }
  }

  const uniqueScopes = [...new Set(normalizedRules.map((rule) => rule.scope))];
  await Promise.all(uniqueScopes.map((scope) => supabaseInsert("api_gateway_events", { scope, client_ip: ip }).catch(() => null)));
  return { allowed: true, ip };
}

export async function getCachedResponse(key) {
  const inMemory = memoryCache.get(key);
  if (inMemory && inMemory.expiresAt > Date.now()) {
    return { hit: true, value: inMemory.value, source: "memory" };
  }

  if (!supabaseEnabled()) return { hit: false };

  const rows = await supabaseSelect(
    "api_response_cache",
    `?select=response&cache_key=eq.${encodeURIComponent(key)}&expires_at=gt.${encodeURIComponent(iso())}&limit=1`
  ).catch(() => ({ data: [] }));
  const row = Array.isArray(rows.data) ? rows.data[0] : null;
  if (!row?.response) return { hit: false };
  return { hit: true, value: row.response, source: "supabase" };
}

export async function setCachedResponse(key, response, ttlSeconds) {
  memoryCache.set(key, {
    value: response,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });

  if (!supabaseEnabled()) return;
  await supabaseUpsert(
    "api_response_cache",
    {
      cache_key: key,
      response,
      expires_at: iso(ttlSeconds),
    },
    "cache_key"
  ).catch(() => null);
}
