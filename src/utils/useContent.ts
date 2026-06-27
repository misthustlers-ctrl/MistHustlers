import { useState, useEffect } from "react";

const CACHE_PREFIX = "mh_content_";
const inFlightRequests = new Map<string, Promise<Record<string, unknown> | null>>();
const inMemoryCache = new Map<string, Record<string, unknown>>();

function asContent(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? value as Record<string, unknown> : null;
}

function readInitialContent(page: string): Record<string, unknown> | null {
  if (typeof window === "undefined") return null;
  const initialContent = (window as typeof window & { __MH_INITIAL_CONTENT__?: Record<string, unknown> }).__MH_INITIAL_CONTENT__;
  return asContent(initialContent?.[page]);
}

function readCachedContent(page: string): Record<string, unknown> | null {
  if (typeof window === "undefined") return null;
  try {
    return asContent(JSON.parse(window.localStorage.getItem(`${CACHE_PREFIX}${page}`) || "null"));
  } catch {
    return null;
  }
}

function loadContent(page: string): Promise<Record<string, unknown> | null> {
  const existing = inFlightRequests.get(page);
  if (existing) return existing;

  const request = fetch(`/api/content/${page}`)
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then((json) => {
      const content = json.success ? asContent(json.data) : null;
      if (!content) return null;
      inMemoryCache.set(page, content);
      try {
        window.localStorage.setItem(`${CACHE_PREFIX}${page}`, JSON.stringify(content));
      } catch {
        /* cache is best-effort */
      }
      return content;
    })
    .catch(() => null)
    .finally(() => inFlightRequests.delete(page));

  inFlightRequests.set(page, request);
  return request;
}

export function useContent<T>(page: string, defaults: T): T {
  const [data, setData] = useState<T>(() => {
    const content = readInitialContent(page) || inMemoryCache.get(page) || readCachedContent(page);
    return content ? { ...defaults, ...content } : defaults;
  });

  useEffect(() => {
    let active = true;
    const cached = inMemoryCache.get(page);
    if (cached) setData({ ...defaults, ...cached });

    loadContent(page).then((content) => {
      if (active && content) setData({ ...defaults, ...content });
    });

    return () => {
      active = false;
    };
  }, [page]);

  return data;
}
