"use client";

import { useSupabaseFetch } from "./use-supabase-fetch";

type CashflowPoint = {
  month: string;
  inflow: number;
  outflow: number;
};

export function useCashflow(accountId?: string) {
  const fetcher = async (supabase: any) => {
    if (!accountId) return [] as CashflowPoint[];

    const { data: rows, error } = await supabase
      .from("transactions")
      .select("amount, date")
      .eq("account_id", accountId)
      .order("date", { ascending: true });

    if (error || !rows) return [] as CashflowPoint[];

    const grouped: Record<string, CashflowPoint> = {};

    rows.forEach((tx: any) => {
      const date = new Date(tx.date);
      const monthLabel = date.toLocaleString("default", { month: "long" });

      if (!grouped[monthLabel]) {
        grouped[monthLabel] = { month: monthLabel, inflow: 0, outflow: 0 };
      }

      if (tx.amount >= 0) {
        grouped[monthLabel].inflow += tx.amount;
      } else {
        grouped[monthLabel].outflow += Math.abs(tx.amount);
      }
    });

    return Object.values(grouped);
  };

  const { data, loading } = useSupabaseFetch<CashflowPoint[]>(
    fetcher,
    [accountId],
    { enabled: !!accountId, initialData: [] },
  );

  return { data: data ?? [], loading };
}
