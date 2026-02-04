import { getExchangeRates } from "@/lib/exchange-rates";
import CurrencyCard from "./currency-card";

export async function CurrencyTracker() {
  const rates = await getExchangeRates();

  return (
    <CurrencyCard
      rates={{
        NZD: rates.NZD,
        USD: rates.USD,
        JPY: rates.JPY,
      }}
      updated={rates.updated}
    />
  );
}
