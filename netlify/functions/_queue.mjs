import { supabaseEnabled, supabaseInsert, supabasePatch, supabaseSelect } from "./_supabase.mjs";

const memoryActive = new Map();

function nowIso(offsetSeconds = 0) {
  return new Date(Date.now() + offsetSeconds * 1000).toISOString();
}

function queued(jobType, activeCount, maxActive) {
  const position = Math.max(1, activeCount - maxActive + 1);
  const retryAfterSeconds = Math.min(120, 12 + position * 8);
  return {
    allowed: false,
    statusCode: 202,
    body: {
      ok: false,
      queued: true,
      jobType,
      position,
      retryAfterSeconds,
      message: `Server is busy. Your ${jobType} request is queued. Retry after ${retryAfterSeconds} seconds.`,
    },
  };
}

export async function claimQueueSlot(jobType, { maxActive = 4, ttlSeconds = 90 } = {}) {
  if (!supabaseEnabled()) {
    const active = memoryActive.get(jobType) || 0;
    if (active >= maxActive) return queued(jobType, active, maxActive);
    memoryActive.set(jobType, active + 1);
    return {
      allowed: true,
      release: async () => memoryActive.set(jobType, Math.max(0, (memoryActive.get(jobType) || 1) - 1)),
    };
  }

  const activeQuery = `?select=id&job_type=eq.${encodeURIComponent(jobType)}&status=eq.running&expires_at=gt.${encodeURIComponent(nowIso())}`;
  const activeRows = await supabaseSelect("backend_job_queue", activeQuery);
  const activeCount = Array.isArray(activeRows.data) ? activeRows.data.length : 0;
  if (activeCount >= maxActive) {
    await supabaseInsert("backend_job_queue", {
      job_type: jobType,
      status: "queued",
      expires_at: nowIso(180),
      meta: { activeCount, maxActive },
    }).catch(() => null);
    return queued(jobType, activeCount, maxActive);
  }

  const inserted = await supabaseInsert("backend_job_queue", {
    job_type: jobType,
    status: "running",
    expires_at: nowIso(ttlSeconds),
    meta: { maxActive },
  });
  const id = Array.isArray(inserted.data) ? inserted.data[0]?.id : null;

  return {
    allowed: true,
    jobId: id,
    release: async (status = "completed") => {
      if (!id) return;
      await supabasePatch("backend_job_queue", `?id=eq.${encodeURIComponent(id)}`, {
        status,
        finished_at: nowIso(),
      }).catch(() => null);
    },
  };
}
