import { useState, useEffect } from "react";

export function useContent<T>(page: string, defaults: T): T {
  const [data, setData] = useState<T>(defaults);

  useEffect(() => {
    fetch(`/api/content/${page}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((json) => {
        if (json.success && json.data) setData({ ...defaults, ...json.data });
      })
      .catch(() => {
        /* use defaults */
      });
  }, [page]);

  return data;
}
