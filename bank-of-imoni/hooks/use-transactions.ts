"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/types/database.types";
import { TransactionsWithCategoriesandAccounts } from "@/app/transactions/columns";

type Tables = Database["public"]["Tables"];
type TransactionsTable = Tables["transactions"];

export type Transaction = TransactionsTable["Row"] &
  TransactionsWithCategoriesandAccounts;

let cachedTransactions: Transaction[] | null = null;

export default function useTransactions() {
  const supabase = createClient();

  const [transactions, setTransactions] = useState<Transaction[]>(
    cachedTransactions ?? [],
  );
  const [loading, setLoading] = useState(!cachedTransactions);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (cachedTransactions) {
      setLoading(false);
      return;
    }

    const fetchTransactions = async () => {
      try {
        const { data, error } = await supabase
          .from("transactions")
          .select(`*, categories(*), accounts(*, profiles(*))`);

        if (error) throw error;

        cachedTransactions = data ?? [];
        setTransactions(cachedTransactions);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [supabase]);

  return { transactions, loading, error };
}
