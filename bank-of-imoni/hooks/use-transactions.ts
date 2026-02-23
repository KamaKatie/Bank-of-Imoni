"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/types/database.types";
import { QueryData, SupabaseClient } from "@supabase/supabase-js";
import { useBrandLogos, BrandData } from "./use-brand-logos";

type DB = Database["public"]["Tables"];

type Account = DB["accounts"]["Row"] & {
  profiles: DB["profiles"]["Row"] | null;
};

type User = DB["profiles"]["Row"];

type Category = DB["categories"]["Row"];

type TransactionParticipants = DB["transaction_participants"]["Row"];

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

// Extend the Transaction type to include brand data
type TransactionWithBrand = Transaction & {
  brandData?: BrandData | null;
};

export default function useTransactions() {
  const supabase = createClient<Database>();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactionParticipants, setTransactionParticipants] = useState<
    TransactionParticipants[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Use the brand logos hook
  const {
    logos,
    loading: brandLoading,
    fetchLogosForTransactions,
    clearCache,
  } = useBrandLogos();

  const refresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  // Fetch logos when transactions are loaded
  useEffect(() => {
    if (transactions.length > 0) {
      const transactionsWithDescriptions = transactions
        .map((t) => ({
          id: t.id,
          description: t.description || "",
        }))
        .filter((t) => t.description && t.description.trim() !== "");

      if (transactionsWithDescriptions.length > 0) {
        fetchLogosForTransactions(transactionsWithDescriptions);
      }
    }
  }, [transactions, fetchLogosForTransactions]);

  // Merge transactions with brand data
  const transactionsWithBrands = useMemo<TransactionWithBrand[]>(() => {
    return transactions.map((transaction) => ({
      ...transaction,
      brandData: logos[transaction.id] || null,
    }));
  }, [transactions, logos]);

  // Combined loading state (either transactions are loading OR any brand is loading)
  const isAnyBrandLoading = useMemo(() => {
    return Object.values(brandLoading).some(Boolean);
  }, [brandLoading]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [
          transactionsRes,
          accountsRes,
          usersRes,
          categoriesRes,
          participantsRes,
        ] = await Promise.all([
          getTransactionsQuery(supabase),
          supabase.from("accounts").select(`*, profiles(*)`),
          supabase.from("profiles").select(`*`),
          supabase
            .from("categories")
            .select(`*`)
            .order("name", { ascending: true }),
          supabase.from("transaction_participants").select(`*`),
        ]);

        if (transactionsRes.error) throw transactionsRes.error;
        if (accountsRes.error) throw accountsRes.error;
        if (usersRes.error) throw usersRes.error;
        if (categoriesRes.error) throw categoriesRes.error;
        if (participantsRes.error) throw participantsRes.error;

        setTransactions(transactionsRes.data ?? []);
        setAccounts(accountsRes.data ?? []);
        setUsers(usersRes.data ?? []);
        setCategories(categoriesRes.data ?? []);
        setTransactionParticipants(participantsRes.data ?? []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshTrigger, supabase]);

  // Optional: Function to manually refresh logos for specific transactions
  const refreshLogos = useCallback(
    async (transactionIds?: string[]) => {
      let transactionsToRefresh = transactions;

      if (transactionIds) {
        transactionsToRefresh = transactions.filter((t) =>
          transactionIds.includes(t.id),
        );
      }

      const transactionsWithDescriptions = transactionsToRefresh
        .map((t) => ({
          id: t.id,
          description: t.description || "",
        }))
        .filter((t) => t.description && t.description.trim() !== "");

      if (transactionsWithDescriptions.length > 0) {
        await fetchLogosForTransactions(transactionsWithDescriptions);
      }
    },
    [transactions, fetchLogosForTransactions],
  );

  // Optional: Clear brand cache
  const clearBrandCache = useCallback(() => {
    clearCache();
  }, [clearCache]);

  return {
    // Data
    transactions: transactionsWithBrands,
    transactionParticipants,
    accounts,
    users,
    categories,

    // Loading states
    loading: loading || isAnyBrandLoading,
    loadingTransactions: loading,
    loadingBrands: brandLoading,

    // Error states
    error,

    // Actions
    refresh,
    refreshLogos,
    clearBrandCache,

    // Helper to check if a specific transaction has a logo
    getTransactionLogo: useCallback(
      (transactionId: string) => {
        return logos[transactionId]?.logo || null;
      },
      [logos],
    ),
  };
}
