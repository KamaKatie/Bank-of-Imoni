"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export function useRecentUserTransactions({ limit = 10 } = {}) {
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);

  // 1️⃣ Get the current logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) setUserId(data.user.id);
    };
    fetchUser();
  }, [supabase]);

  // 2️⃣ Fetch accounts and transactions for the user
  const query = useQuery({
    queryKey: ["current-user-transactions-and-accounts", userId, limit],
    queryFn: async () => {
      if (!userId) return { accounts: [], transactions: [] };

      // Get all accounts for the user
      const { data: accounts, error: accountsError } = await supabase
        .from("accounts")
        .select("*")
        .eq("user", userId);

      if (accountsError) throw accountsError;

      if (!accounts?.length) return { accounts: [], transactions: [] };

      const accountIds = accounts.map((a) => a.id);

      // Fetch transactions for all accounts
      const { data: transactions, error: transactionsError } = await supabase
        .from("transactions")
        .select("*")
        .in("paid_by_account", accountIds)
        .order("date", { ascending: false })
        .limit(limit);

      if (transactionsError) throw transactionsError;

      return { accounts, transactions: transactions ?? [] };
    },
    enabled: !!userId,
    initialData: { accounts: [], transactions: [] },
  });

  return {
    accounts: query.data?.accounts ?? [],
    transactions: query.data?.transactions ?? [],
    isLoading: query.isLoading,
    error: query.error,
  };
}
