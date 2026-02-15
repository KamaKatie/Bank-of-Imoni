"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export function useRecentTransactions({
  accountId,
  limit = 10,
}: {
  accountId?: string;
  limit?: number;
}) {
  const supabase = createClient();

  const query = useQuery({
    queryKey: ["recent-transactions", accountId, limit],
    queryFn: async () => {
      let builder = supabase
        .from("transactions")
        .select("*")
        .order("date", { ascending: false })
        .limit(limit);

      if (accountId) {
        builder = builder.eq("paid_by_account", accountId);
      }

      const { data, error } = await builder;
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!accountId,
    initialData: [],
  });

  return {
    transactions: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
}
