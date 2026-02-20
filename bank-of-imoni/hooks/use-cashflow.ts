"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type CashflowPoint = {
  month: string;
  inflow: number;
  outflow: number;
};

export function useCashflow(accountId?: string) {
  const supabase = createClient();
  const [data, setData] = useState<CashflowPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accountId) return;

    const fetchCashflow = async () => {
      setLoading(true);
      const { data: rows, error } = await supabase
        .from("transactions")
        .select("amount, date")
        .eq("account_id", accountId)
        .order("date", { ascending: true }); 

      if (error || !rows) {
        setData([]);
        setLoading(false);
        return;
      }

      const grouped: Record<string, CashflowPoint> = {};

      rows.forEach((tx) => {
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

      setData(Object.values(grouped));
      setLoading(false);
    };

    fetchCashflow();
  }, [accountId]); 

  return { data, loading };
}
