"use client";

import { useEffect, useState, useCallback } from "react";
import { Database } from "@/types/database.types";
import { QueryData } from "@supabase/supabase-js";
import { useSupabaseFetch } from "./use-supabase-fetch";

type DB = Database["public"]["Tables"];

type Account = DB["accounts"]["Row"] & {
  profiles: DB["profiles"]["Row"] | null;
};

type User = DB["profiles"]["Row"];

type Category = DB["categories"]["Row"];

function getTransactionsQuery(client: any) {
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

type Transaction = DB["transactions"]["Row"] & {
  categories: DB["categories"]["Row"] | null;
  accounts: Account | null;
  payer: DB["profiles"]["Row"] | null; // joined via user_id fkey
};

export default function useTransactions() {
  const fetcher = async (supabase: any) => {
    const [
      transactionsRes,
      accountsRes,
      usersRes,
      categoriesRes,
    ] = await Promise.all([
      getTransactionsQuery(supabase),
      supabase.from("accounts").select(`*, profiles(*)`),
      supabase.from("profiles").select(`*`),
      supabase
        .from("categories")
        .select(`*`)
        .order("name", { ascending: true }),
    ]);

    if (transactionsRes.error) throw transactionsRes.error;
    if (accountsRes.error) throw accountsRes.error;
    if (usersRes.error) throw usersRes.error;
    if (categoriesRes.error) throw categoriesRes.error;

    return {
      transactions: transactionsRes.data ?? [],
      accounts: accountsRes.data ?? [],
      users: usersRes.data ?? [],
      categories: categoriesRes.data ?? [],
    };
  };

  const { data, loading, error, refresh } = useSupabaseFetch(fetcher, []);

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
