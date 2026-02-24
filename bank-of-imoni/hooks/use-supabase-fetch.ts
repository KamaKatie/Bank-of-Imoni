"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";

type Fetcher<T> = (supabase: any) => Promise<T>;

export function useSupabaseFetch<T>(
  fetcher: Fetcher<T>,
  deps: any[] = [],
  options?: { enabled?: boolean; initialData?: T },
) {
  const supabase = useMemo(() => createClient(), []);
  const enabled = options?.enabled ?? true;

  const [data, setData] = useState<T | null>(options?.initialData ?? null);
  const [loading, setLoading] = useState<boolean>(
    enabled && !options?.initialData,
  );
  const [error, setError] = useState<unknown | null>(null);
  const [trigger, setTrigger] = useState(0);

  const refresh = useCallback(() => setTrigger((t) => t + 1), []);

  useEffect(() => {
    if (!enabled) return;

    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetcher(supabase);
        if (!mounted) return;
        setData(result);
      } catch (err) {
        if (!mounted) return;
        setError(err);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
    // include trigger so calling refresh re-runs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger, enabled, ...deps]);

  return { data, setData, loading, error, refresh } as const;
}
