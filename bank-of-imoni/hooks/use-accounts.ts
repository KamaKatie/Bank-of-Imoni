"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

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
  const supabase = createClient();
  const [accounts, setAccounts] = useState<Account[]>(cachedAccounts ?? []);
  const [loading, setLoading] = useState(!cachedAccounts);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (cachedAccounts) return;

    const fetchAccounts = async () => {
      try {
        const { data: auth } = await supabase.auth.getUser();
        if (!auth?.user) return;

        const { data, error } = await supabase
          .from("accounts")
          .select("id, name, current_balance, type, icon, placeholder_img")
          .order("name", { ascending: true })
          .eq("user", auth.user.id);

        if (error) throw error;

        cachedAccounts = data ?? [];
        setAccounts(cachedAccounts);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [supabase]);

  const workingBalance = accounts.reduce(
    (total, a) => total + (a.current_balance ?? 0),
    0,
  );

  return {
    accounts,
    workingBalance,
    loading,
    error,
  };
}
