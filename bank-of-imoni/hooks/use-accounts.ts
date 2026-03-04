"use client";

import { useEffect } from "react";
import { useSupabaseFetch } from "./use-supabase-fetch";

export type Account = {
  id: string;
  name: string;
  current_balance: number;
  type: string | null;
  icon: string;
  placeholder_img: string;
};

let cachedAccounts: Account[] | null = null;

export function useAccounts() {
  const fetcher = async (supabase: any) => {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth?.user) return [] as Account[];

    const { data, error } = await supabase
      .from("accounts")
      .select("id, name, current_balance, type, icon, placeholder_img")
      .order("name", { ascending: true })
      .eq("user", auth.user.id);

    if (error) throw error;
    return (data ?? []) as Account[];
  };

  const {
    data: accountsData,
    loading,
    error,
    refresh,
  } = useSupabaseFetch<Account[]>(fetcher, [], {
    enabled: true,
    initialData: cachedAccounts ?? undefined,
  });

  useEffect(() => {
    if (cachedAccounts || !accountsData) return;
    cachedAccounts = accountsData;
  }, [accountsData]);

  const accounts = accountsData ?? [];

  const workingBalance = accounts.reduce(
    (total, a) => total + (a.current_balance ?? 0),
    0,
  );

  return {
    accounts,
    workingBalance,
    loading,
    error: error as Error | null,
    refresh,
  };
}
