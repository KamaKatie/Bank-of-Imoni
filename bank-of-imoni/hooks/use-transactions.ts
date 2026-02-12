"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/types/database.types";
import { QueryData, SupabaseClient } from "@supabase/supabase-js";

type DB = Database["public"]["Tables"];

type Account = DB["accounts"]["Row"] & {
  profiles: DB["profiles"]["Row"] | null;
};

type User = DB["profiles"]["Row"];

type Category = DB["categories"]["Row"];

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
      )
    `,
    )
    .order("date", { ascending: false });
}

type Transaction = QueryData<ReturnType<typeof getTransactionsQuery>>[number];

export default function useTransactions() {
  const supabase = createClient<Database>();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [transactionsRes, accountsRes, usersRes, categoriesRes] =
          await Promise.all([
            getTransactionsQuery(supabase),
            supabase.from("accounts").select(`*, profiles(*)`),
            supabase.from("profiles").select(`*`),
            supabase.from("categories").select(`*`),
          ]);

        if (transactionsRes.error) throw transactionsRes.error;
        if (accountsRes.error) throw accountsRes.error;
        if (usersRes.error) throw usersRes.error;
        if (categoriesRes.error) throw categoriesRes.error;

        setTransactions(transactionsRes.data ?? []);
        setAccounts(accountsRes.data ?? []);
        setUsers(usersRes.data ?? []);
        setCategories(categoriesRes.data ?? []);
      } catch (err) {
        console.error(err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase]);

  return { transactions, accounts, users, categories, loading, error };
}
