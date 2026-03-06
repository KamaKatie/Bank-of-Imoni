"use client";

import { useSupabaseQuery } from "./use-supabase-query";

export function useTransactionStats() {
  const query = useSupabaseQuery(
    ["transaction-stats"],
    async (supabase) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return [];

      const { data, error } = await supabase
        .from("transaction_monthly_stats")
        .select("*")
        .eq("user", user.id)
        .order("month");

      if (error) throw error;

      return data ?? [];
    },
    { initialData: [] },
  );

  return {
    stats: query.data ?? [],
    isLoading: query.isLoading,
  };
}
