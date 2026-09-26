function env(name) {
  const workerEnv = globalThis.__CF_ENV__ || {};
  const value = workerEnv[name];
  if (value !== undefined && value !== null) return String(value);
  if (typeof process !== "undefined") return process.env[name] || "";
  return "";
}

function supabaseRestUrl() {
  const raw = env("SUPABASE_URL").trim().replace(/\/$/, "");
  if (!raw) return "";
  if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(raw)) {
    console.warn("SUPABASE_URL must be the Supabase project REST URL, not a database connection string.");
    return "";
  }
  return raw;
}

export function supabaseEnabled() {
  return !!supabaseRestUrl() && !!env("SUPABASE_SERVICE_ROLE_KEY");
}

function supabaseAnonKey() {
  return env("SUPABASE_ANON_KEY") || env("VITE_SUPABASE_ANON_KEY");
}

export function supabaseAuthEnabled() {
  return !!supabaseRestUrl() && !!supabaseAnonKey();
}

function bearerToken(event) {
  const headers = event?.headers || {};
  const value = headers.authorization || headers.Authorization || "";
  const match = String(value).match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || "";
}

export async function requireSupabaseUser(event) {
  const token = bearerToken(event);
  if (!token) {
    return {
      ok: false,
      statusCode: 401,
      body: { ok: false, error: "Unauthorized. Sign in with Google before running an SEO audit." },
    };
  }

  const url = supabaseRestUrl();
  const key = supabaseAnonKey();
  if (!url || !key) {
    return {
      ok: false,
      statusCode: 500,
      body: { ok: false, error: "Supabase authentication is not configured." },
    };
  }

  const res = await fetch(`${url}/auth/v1/user`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.id) {
    return {
      ok: false,
      statusCode: 401,
      body: { ok: false, error: "Unauthorized. Your Google session is invalid or expired." },
    };
  }

  return { ok: true, user: data, token };
}

export async function supabaseInsert(table, payload) {
  const url = supabaseRestUrl();
  const key = env("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) {
    return { ok: false, skipped: true, reason: "Supabase env vars are not set." };
  }

  const res = await fetch(`${url}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    throw new Error(data?.message || data?.error || `Supabase insert failed (${res.status})`);
  }
  return { ok: true, data };
}

export async function supabaseSelect(table, query = "") {
  const url = supabaseRestUrl();
  const key = env("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) {
    return { ok: false, skipped: true, data: [] };
  }

  const res = await fetch(`${url}/rest/v1/${table}${query}`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
  });
  const data = await res.json().catch(() => []);
  if (!res.ok) {
    throw new Error(data?.message || data?.error || `Supabase select failed (${res.status})`);
  }
  return { ok: true, data };
}

export async function supabasePatch(table, query, payload) {
  const url = supabaseRestUrl();
  const key = env("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) {
    return { ok: false, skipped: true };
  }

  const res = await fetch(`${url}/rest/v1/${table}${query}`, {
    method: "PATCH",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message || data?.error || `Supabase update failed (${res.status})`);
  }
  return { ok: true };
}

export async function supabaseUpsert(table, payload, conflictColumn) {
  const url = supabaseRestUrl();
  const key = env("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) {
    return { ok: false, skipped: true };
  }

  const suffix = conflictColumn ? `?on_conflict=${encodeURIComponent(conflictColumn)}` : "";
  const res = await fetch(`${url}/rest/v1/${table}${suffix}`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message || data?.error || `Supabase upsert failed (${res.status})`);
  }
  return { ok: true };
}
