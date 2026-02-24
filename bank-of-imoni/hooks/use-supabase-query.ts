"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useMemo } from "react";
import { createClient } from "@/lib/supabase/client";

type Fetcher<T> = (supabase: any) => Promise<T>;

export function useSupabaseQuery<TData = unknown, TError = unknown>(
  queryKey: any[],
  fetcher: Fetcher<TData>,
  options?: Omit<UseQueryOptions<TData, TError, TData>, "queryKey" | "queryFn">,
) {
  const supabase = useMemo(() => createClient(), []);

  const query = useQuery<TData, TError>({
    queryKey,
    queryFn: async () => fetcher(supabase),
    ...options,
  });

  return query;
}
