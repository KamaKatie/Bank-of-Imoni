"use client";

import { useSupabaseQuery } from "./use-supabase-query";
import { useEffect, useState } from "react";

export function useAccountTransactions(accountId: string | undefined) {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await (await import("@/lib/supabase/client"))
        .createClient()
        .auth.getUser();
      if (data.user) setUserId(data.user.id);
    };
    fetchUser();
  }, []);

  const query = useSupabaseQuery(
    ["account-transactions", accountId, userId],
    async (supabase) => {
      if (!accountId || !userId) return { transactions: [] };

      const { data: transactions, error } = await supabase
        .from("transactions")
        .select("*, categories(name, icon)")
        .eq("paid_by_account", accountId)
        .order("date", { ascending: false });

      if (error) throw error;

      return { transactions: transactions ?? [] };
    },
    { enabled: !!accountId && !!userId, initialData: { transactions: [] } },
  );

  return {
    transactions: query.data?.transactions ?? [],
    loading: query.isLoading,
    error: query.error,
  };
}