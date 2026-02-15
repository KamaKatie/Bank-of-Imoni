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
  try {
    const rows = [
      { currency: "JPY", rate: rates.JPY },
      { currency: "NZD", rate: rates.NZD },
    ];

    const { error } = await supabase.from("exchange_rates").upsert(rows, {
      onConflict: "currency,recorded_date",
    });

    if (error) {
      // Check if it's an abort error
      if (error.message?.includes("abort") || error.name === "AbortError") {
        console.log("Request was aborted (this is normal in development)");
        return;
      }
      console.error("Failed to persist exchange rates", error);
    }
  } catch (error: any) {
    // Handle abort errors specifically
    if (error.name === "AbortError" || error.message?.includes("abort")) {
      console.log("Request was aborted (this is normal in development)");
      return;
    }
    console.error("Failed to persist exchange rates", error);
  }
}

export async function getCurrencyHistory(
  currency: "USD" | "JPY" | "NZD",
  limit = 14,
): Promise<HistoryPoint[]> {
  try {
    const { data, error } = await supabase
      .from("exchange_rates")
      .select("rate, recorded_at")
      .eq("currency", currency)
      .order("recorded_at", { ascending: false })
      .limit(limit);

    if (error || !data) {
      // Check if it's an abort error
      if (error?.message?.includes("abort") || error?.name === "AbortError") {
        console.log("Request was aborted (this is normal in development)");
        return [];
      }
      console.error("Failed to fetch currency history", error);
      return [];
    }

    return data.reverse().map((row) => ({
      t: row.recorded_at,
      v: row.rate,
    }));
  } catch (error: any) {
    // Handle abort errors specifically
    if (error.name === "AbortError" || error.message?.includes("abort")) {
      console.log("Request was aborted (this is normal in development)");
      return [];
    }
    console.error("Failed to fetch currency history", error);
    return [];
  }
}
