"use client";

import { useSupabaseFetch } from "./use-supabase-fetch";

export function useCategories() {
  const fetcher = async (supabase: any) => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });
    if (error) throw error;
    return data ?? [];
  };

  const { data, loading, error } = useSupabaseFetch<any[]>(fetcher, []);

  return { categories: data ?? [], loading, error };
}
