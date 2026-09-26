import { useEffect, useState } from "react";

const DRAFT_TTL_MS = 30 * 24 * 60 * 60 * 1000;

type StoredDraft<T> = {
  savedAt: number;
  data: T;
};

function restoreDraft<T extends Record<string, string>>(key: string, defaults: T): T {
  if (typeof window === "undefined") return defaults;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return defaults;
    const stored = JSON.parse(raw) as StoredDraft<Partial<T>>;
    if (!stored?.savedAt || Date.now() - stored.savedAt > DRAFT_TTL_MS || !stored.data || typeof stored.data !== "object") {
      window.localStorage.removeItem(key);
      return defaults;
    }

    const restored = { ...defaults };
    for (const field of Object.keys(defaults) as Array<keyof T>) {
      if (typeof stored.data[field] === "string") restored[field] = stored.data[field] as T[keyof T];
    }
    return restored;
  } catch {
    window.localStorage.removeItem(key);
    return defaults;
  }
}

export function usePersistentForm<T extends Record<string, string>>(key: string, defaults: T) {
  const [value, setValue] = useState<T>(() => restoreDraft(key, defaults));

  useEffect(() => {
    try {
      if (JSON.stringify(value) === JSON.stringify(defaults)) {
        window.localStorage.removeItem(key);
        return;
      }
      const stored: StoredDraft<T> = { savedAt: Date.now(), data: value };
      window.localStorage.setItem(key, JSON.stringify(stored));
    } catch {
      // Storage can be unavailable in private browsing or restricted browsers.
    }
  }, [defaults, key, value]);

  const clearDraft = () => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Keep successful submission independent from browser storage availability.
    }
    setValue(defaults);
  };

  return [value, setValue, clearDraft] as const;
}
