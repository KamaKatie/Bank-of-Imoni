"use client";

import { useSupabaseQuery } from "./use-supabase-query";
import { useEffect, useState } from "react";

export function useRecentUserTransactions({ limit = 10 } = {}) {
  const [userId, setUserId] = useState<string | null>(null);

  // 1️⃣ Get the current logged-in user
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
    ["current-user-transactions-and-accounts", userId, limit],
    async (supabase) => {
      if (!userId) return { accounts: [], transactions: [] };

      const { data: accounts, error: accountsError } = await supabase
        .from("accounts")
        .select("*")
        .eq("user", userId);

      if (accountsError) throw accountsError;

      if (!accounts?.length) return { accounts: [], transactions: [] };

      const accountIds = accounts.map((a: any) => a.id);

      const { data: transactions, error: transactionsError } = await supabase
        .from("transactions")
        .select("*")
        .in("paid_by_account", accountIds)
        .order("date", { ascending: false })
        .limit(limit);

      if (transactionsError) throw transactionsError;

      return { accounts, transactions: transactions ?? [] };
    },
    { enabled: !!userId, initialData: { accounts: [], transactions: [] } },
  );

  return {
    accounts: query.data?.accounts ?? [],
    transactions: query.data?.transactions ?? [],
    isLoading: query.isLoading,
    error: query.error,
  };
}
