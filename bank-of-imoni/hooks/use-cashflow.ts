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
      const { data: rows, error } = await supabase
        .from("transactions")
        .select("amount, date")
        .eq("account_id", accountId);

      if (error || !rows) {
        setLoading(false);
        return;
      }

      // group by month
      const grouped: Record<string, CashflowPoint> = {};

      for (const tx of rows) {
        const month = new Date(tx.date).toLocaleString("default", {
          month: "long",
        });

        if (!grouped[month]) {
          grouped[month] = { month, inflow: 0, outflow: 0 };
        }

        if (tx.amount >= 0) {
          grouped[month].inflow += tx.amount;
        } else {
          grouped[month].outflow += Math.abs(tx.amount);
        }
      }

      setData(Object.values(grouped));
      setLoading(false);
    };

    fetchCashflow();
  }, [accountId, supabase]);

  return { data, loading };
}
