import { useState, useEffect } from "react";

const CACHE_PREFIX = "mh_content_";

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
  const [data, setData] = useState<T>(() => readCachedContent(page, defaults));

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
