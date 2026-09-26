import { handler as fetchAuditHtml } from "./fetch-audit-html.mjs";
import { requireSupabaseUser, supabaseInsert } from "./_supabase.mjs";
import { claimQueueSlot } from "./_queue.mjs";
import { cacheKey, enforceRateLimits, getCachedResponse, setCachedResponse } from "./_gateway.mjs";

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

function extract(re, html) {
  const m = html.match(re);
  return m ? m[1].trim() : null;
}

function getAttr(tag, name) {
  const re = new RegExp(`${name}\\s*=\\s*["']([^"']*)["']`, "i");
  return tag.match(re)?.[1]?.trim() || null;
}

function metaContent(html, attr, value) {
  const tags = html.match(/<meta\b[^>]*>/gi) || [];
  for (const tag of tags) {
    if ((getAttr(tag, attr) || "").toLowerCase() === value.toLowerCase()) {
      return getAttr(tag, "content");
    }
  }
  return null;
}

function stripTrailingSlash(value) {
  const s = String(value || "");
  return s.length > 1 && s.endsWith("/") ? s.slice(0, -1) : s;
}

function normalizeUrl(input) {
  let value = String(input || "").trim();
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("//")) return `https:${value}`;
  return `https://${value}`;
}

function resolveUrlMaybe(value, base) {
  try {
    return stripTrailingSlash(new URL(value, base).toString());
  } catch {
    return stripTrailingSlash(value);
  }
}

function textContent(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreHtml(rawUrl, html, trafficHint = "") {
  const target = stripTrailingSlash(normalizeUrl(rawUrl));
  const targetHost = new URL(target).hostname;
  const checks = [];

  const title = extract(/<title[^>]*>(.*?)<\/title>/is, html);
  checks.push({
    id: "title",
    label: "Title tag",
    passed: !!title && title.length >= 10 && title.length <= 75,
    detail: title ? `${title.slice(0, 80)} (${title.length} chars, ideal 10-60)` : "Missing",
    weight: 10,
    group: "content",
  });

  const desc = metaContent(html, "name", "description");
  checks.push({
    id: "desc",
    label: "Meta description",
    passed: !!desc && desc.length >= 50,
    detail: desc ? `${desc.slice(0, 100)}... (${desc.length} chars, ideal 120-160)` : "Missing",
    weight: 10,
    group: "content",
  });

  const h1Count = [...html.matchAll(/<h1[\s>]/gi)].length;
  checks.push({
    id: "h1",
    label: "H1 heading",
    passed: h1Count === 1,
    detail: `${h1Count} H1 found (exactly 1 ideal)`,
    weight: 8,
    group: "structure",
  });

  const canonicals = [...html.matchAll(/rel=["']canonical["'][^>]*href=["']([^"']+)["']/gi)].map((m) => m[1]);
  const canonicalOk = canonicals.length === 1 && resolveUrlMaybe(canonicals[0], target) === target;
  checks.push({
    id: "canonical",
    label: "Canonical tag",
    passed: canonicalOk,
    detail: canonicals.length ? `found ${canonicals.length}: ${canonicals[0]}` : "Missing",
    weight: 10,
    group: "technical",
  });

  const og = {
    url: !!metaContent(html, "property", "og:url"),
    title: !!metaContent(html, "property", "og:title"),
    desc: !!metaContent(html, "property", "og:description"),
    image: !!metaContent(html, "property", "og:image"),
  };
  checks.push({
    id: "og",
    label: "Open Graph tags",
    passed: og.url && og.title && og.desc && og.image,
    detail: `url=${og.url ? "pass" : "fail"} title=${og.title ? "pass" : "fail"} desc=${og.desc ? "pass" : "fail"} image=${og.image ? "pass" : "fail"}`,
    weight: 8,
    group: "social",
  });

  const twitterCard = metaContent(html, "name", "twitter:card");
  checks.push({
    id: "twitter",
    label: "Twitter card",
    passed: !!twitterCard,
    detail: twitterCard || "Missing",
    weight: 4,
    group: "social",
  });

  const jsonLdScripts = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  const jsonLdValid = jsonLdScripts.some((script) => {
    try {
      JSON.parse(script[1] || "");
      return true;
    } catch {
      return false;
    }
  });
  checks.push({
    id: "schema",
    label: "JSON-LD structured data",
    passed: jsonLdValid,
    detail: `${jsonLdScripts.length} schema script(s), ${jsonLdValid ? "valid" : "invalid/missing"}`,
    weight: 10,
    group: "technical",
  });

  const images = [...html.matchAll(/<img[^>]*>/gi)].map((t) => t[0]);
  const noAlt = images.filter((t) => !/alt=/i.test(t)).length;
  checks.push({
    id: "alt",
    label: "Image alt text",
    passed: images.length === 0 || noAlt === 0,
    detail: `${images.length - noAlt}/${images.length} images have alt (${noAlt} missing)`,
    weight: 6,
    group: "content",
  });

  const headings = [...html.matchAll(/<h([1-6])[\s>]/gi)].map((m) => Number(m[1]));
  checks.push({
    id: "headings",
    label: "Heading hierarchy",
    passed: headings.indexOf(1) !== -1,
    detail: `h1=${headings.filter((h) => h === 1).length}, h2=${headings.filter((h) => h === 2).length}, h3=${headings.filter((h) => h === 3).length}`,
    weight: 6,
    group: "structure",
  });

  const viewport = metaContent(html, "name", "viewport");
  checks.push({
    id: "viewport",
    label: "Mobile viewport",
    passed: !!viewport && /width=device-width/i.test(viewport || ""),
    detail: viewport || "Missing",
    weight: 8,
    group: "technical",
  });

  const langAttr = extract(/<html[^>]*lang=["']([^"']*)["']/i, html);
  checks.push({
    id: "lang",
    label: "HTML lang attribute",
    passed: !!langAttr,
    detail: langAttr || "Missing",
    weight: 4,
    group: "technical",
  });

  const robots = metaContent(html, "name", "robots");
  const blocksIndexing = !!robots && /(^|,|\s)(noindex|none)(,|\s|$)/i.test(robots);
  checks.push({
    id: "robots",
    label: "Robots indexing",
    passed: !blocksIndexing,
    detail: robots ? `robots="${robots}"${blocksIndexing ? " blocks indexing" : " allows indexing"}` : "No robots block found",
    weight: 8,
    group: "technical",
  });

  const internalLinks = [...html.matchAll(/<a[^>]+href=["']([^"']+)["']/gi)]
    .map((m) => m[1])
    .filter((href) => href && !href.startsWith("#") && !/^mailto:|^tel:|^javascript:/i.test(href))
    .filter((href) => href.startsWith("/") || href.includes(targetHost));
  checks.push({
    id: "internal-links",
    label: "Internal link structure",
    passed: internalLinks.length >= 3,
    detail: `${internalLinks.length} useful internal link(s) found (ideal 3+)`,
    weight: 6,
    group: "structure",
  });

  const bodyLen = textContent(html).length;
  checks.push({
    id: "body",
    label: "Content depth",
    passed: bodyLen > 200,
    detail: `${bodyLen} chars of body text (ideal > 200)`,
    weight: 6,
    group: "content",
  });

  const total = checks.length;
  const passed = checks.filter((c) => c.passed).length;
  const score = Math.round((passed / total) * 100);
  return { url: target, score, passed, total, checks, createdAt: new Date().toISOString(), trafficHint };
}

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return json(405, { ok: false, error: "Method not allowed" });
  }

  try {
    const auth = await requireSupabaseUser(event);
    if (!auth.ok) return json(auth.statusCode, auth.body);

    const body = JSON.parse(event.body || "{}");
    const url = normalizeUrl(body.url);
    const trafficHint = String(body.trafficHint || "");
    if (!url) {
      return json(400, { ok: false, error: "Website URL is required." });
    }

    const gate = await enforceRateLimits(event, [
      { scope: "seo-audit", maxRequests: 6, windowSeconds: 60 },
      { scope: "seo-audit", maxRequests: 30, windowSeconds: 3600 },
    ]);
    if (!gate.allowed) return gate.response;

    const key = cacheKey("seo-audit", { url });
    const cached = await getCachedResponse(key);
    if (cached.hit) {
      return json(200, { ...cached.value, cached: true, cacheSource: cached.source });
    }

    const slot = await claimQueueSlot("seo-audit", { maxActive: 8, ttlSeconds: 120 });
    if (!slot.allowed) return json(slot.statusCode, slot.body);

    try {
      const fetched = await fetchAuditHtml({
        httpMethod: "POST",
        headers: event.headers || {},
        body: JSON.stringify({ url }),
      });
      const payload = JSON.parse(fetched.body || "{}");
      if (fetched.statusCode >= 400 || !payload.ok || typeof payload.html !== "string") {
        await slot.release("failed");
        return json(fetched.statusCode || 500, {
          ok: false,
          error: payload.error || "Could not fetch website HTML.",
        });
      }

      const result = scoreHtml(url, payload.html, trafficHint);
      let savedToDatabase = false;
      let databaseError = "";
      try {
        const saved = await supabaseInsert("seo_audit_runs", {
          url: result.url,
          score: result.score,
          passed: result.passed,
          total: result.total,
          checks: result.checks,
          traffic_hint: result.trafficHint,
          user_id: auth.user.id,
          fetch_mode: payload.mode || "unknown",
          html_length: payload.html.length,
        });
        savedToDatabase = !!saved.ok;
      } catch (error) {
        databaseError = error instanceof Error ? error.message : "Database save failed.";
      }

      const response = {
        ok: true,
        queued: false,
        cached: false,
        mode: "server-audit",
        fetchMode: payload.mode,
        htmlLength: payload.html.length,
        savedToDatabase,
        databaseError,
        result,
      };
      await setCachedResponse(key, response, 21600);
      await slot.release("completed");
      return json(200, response);
    } catch (error) {
      await slot.release("failed");
      throw error;
    }
  } catch (error) {
    return json(500, {
      ok: false,
      error: error instanceof Error ? error.message : "SEO audit failed.",
    });
  }
}
