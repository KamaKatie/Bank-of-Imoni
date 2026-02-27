"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function useUserBalance() {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchBalance = async () => {
    setLoading(true);

    // 1. Get the current logged-in user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // 2. Fetch all impacts
    const { data, error } = await supabase
      .from("transactions")
      .select("debt_impact")
      .is("deleted_at", null);

    if (!error && data) {
      // The SQL trigger already handles the "Who Paid" logic:
      // If User A paid, impact is +
      // If User B paid, impact is -
      const totalSum = data.reduce(
        (acc, curr) => acc + (Number(curr.debt_impact) || 0),
        0,
      );

      // 3. We only need to know if the logged-in user is 'User A' or 'User B'
      // to decide if the totalSum means "Owed" or "Owe".
      // Let's assume the first person in the DB is always the 'Positive' side.
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .order("id", { ascending: true })
        .limit(1)
        .single();

      // If I am the first user, positive sum means I am owed.
      // If I am NOT the first user, positive sum means I owe (so flip it).
      const isFirstUser = user.id === profile?.id;
      setBalance(isFirstUser ? totalSum : -totalSum);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBalance();
    const channel = supabase
      .channel("realtime-balance")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "transactions" },
        fetchBalance,
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { balance, loading, refresh: fetchBalance };
}
