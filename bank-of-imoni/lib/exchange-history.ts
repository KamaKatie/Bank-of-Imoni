import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { ExchangeRates } from "./exchange-rates";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export type HistoryPoint = {
  t: string;
  v: number;
};

export async function persistExchangeRates(rates: ExchangeRates) {
  const rows = [
    { currency: "USD", rate: rates.USD },
    { currency: "JPY", rate: rates.JPY },
    { currency: "NZD", rate: rates.NZD },
  ];

  const { error } = await supabase.from("exchange_rates").upsert(rows, {
    onConflict: "currency,recorded_date",
  });
  if (error) {
    console.error("Failed to persist exchange rates", error);
  }
}

export async function getCurrencyHistory(
  currency: "USD" | "JPY" | "NZD",
  limit = 14,
): Promise<HistoryPoint[]> {
  const { data, error } = await supabase
    .from("exchange_rates")
    .select("rate, recorded_at")
    .eq("currency", currency)
    .order("recorded_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    console.error("Failed to fetch currency history", error);
    return [];
  }

  return data.reverse().map((row) => ({
    t: row.recorded_at,
    v: row.rate,
  }));
}
