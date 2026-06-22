import { useState, useEffect } from "react";

const CACHE_PREFIX = "mh_content_";

function readInitialContent<T>(page: string, defaults: T): T | null {
  if (typeof window === "undefined") return null;
  const initialContent = (window as typeof window & { __MH_INITIAL_CONTENT__?: Record<string, unknown> }).__MH_INITIAL_CONTENT__;
  const data = initialContent?.[page];
  return data && typeof data === "object" ? { ...defaults, ...(data as Partial<T>) } : null;
}

function readCachedContent<T>(page: string, defaults: T): T {
  if (typeof window === "undefined") return defaults;
  try {
    const cached = window.localStorage.getItem(`${CACHE_PREFIX}${page}`);
    return cached ? { ...defaults, ...JSON.parse(cached) } : defaults;
  } catch {
    return defaults;
  }
}

export function useContent<T>(page: string, defaults: T): T {
  const [data, setData] = useState<T>(() => readInitialContent(page, defaults) || readCachedContent(page, defaults));

  useEffect(() => {
    fetch(`/api/content/${page}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((json) => {
        if (json.success && json.data) {
          try {
            window.localStorage.setItem(`${CACHE_PREFIX}${page}`, JSON.stringify(json.data));
          } catch {
            /* cache is best-effort */
          }
          setData({ ...defaults, ...json.data });
        }
      })
      .catch(() => {
        /* use defaults */
      });
  }, [page]);

  return data;
}
