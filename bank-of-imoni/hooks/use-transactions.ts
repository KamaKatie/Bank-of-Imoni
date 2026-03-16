"use client";

import { useEffect } from "react";
import { Database } from "@/database.types";
import { useSupabaseFetch } from "./use-supabase-fetch";
import { createClient } from "@/lib/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";

function getTransactionsQuery(client: SupabaseClient<Database>) {
  return client
    .from("transactions")
    .select(
      `
      *,
      categories(*),
      accounts:paid_by_account(
        *,
        profiles(*)
      ),
      payer:profiles!transactions_user_id_fkey(*)
    `,
    )
    .order("date", { ascending: false });
}

export default function useTransactions() {
  const supabase = createClient<Database>();

  const fetcher = async (client: SupabaseClient<Database>) => {
    const [transactionsRes, accountsRes, usersRes, categoriesRes] =
      await Promise.all([
        getTransactionsQuery(client),
        client.from("accounts").select(`*, profiles(*)`),
        client.from("profiles").select(`*`),
        client
          .from("categories")
          .select(`*`)
          .order("name", { ascending: true }),
      ]);

    if (transactionsRes.error) throw transactionsRes.error;

    return {
      transactions: transactionsRes.data ?? [],
      accounts: accountsRes.data ?? [],
      users: usersRes.data ?? [],
      categories: categoriesRes.data ?? [],
    };
  };

  const { data, loading, error, refresh } = useSupabaseFetch(fetcher, []);

  useEffect(() => {
    const channel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "transactions" },
        () => {
          refresh();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, refresh]);

  return {
    transactions: data?.transactions ?? [],
    accounts: data?.accounts ?? [],
    users: data?.users ?? [],
    categories: data?.categories ?? [],
    loading,
    error: error as Error | null,
    refresh,
  };
}
