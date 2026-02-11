"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/types/database.types";
import { TransactionsWithCategoriesandAccounts } from "@/app/transactions/columns";

type Tables = Database["public"]["Tables"];
type TransactionsTable = Tables["transactions"];

export type Transaction = TransactionsTable["Row"] &
  TransactionsWithCategoriesandAccounts;

// Remove global cache or make it a module-level variable with better management
export default function useTransactions() {
  const supabase = createClient();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("transactions")
          .select(`*, categories(*), accounts(*, profiles(*))`)
          .order("date", { ascending: false }); // Optional: add ordering

        if (error) throw error;

        setTransactions(data ?? []);
      } catch (err) {
        setError(err as Error);
        console.error("Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [supabase]);

  return { transactions, loading, error };
}
