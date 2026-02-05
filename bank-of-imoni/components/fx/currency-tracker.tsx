import { getExchangeRates } from "@/lib/exchange-rates";
import { persistExchangeRates } from "@/lib/exchange-history";
import { getCurrencyHistory } from "@/lib/exchange-history";
import CurrencyCard from "./currency-card";

export async function CurrencyTracker() {
  const [rates, jpyHistory, nzdHistory] = await Promise.all([
    getExchangeRates(),
    getCurrencyHistory("JPY"),
    getCurrencyHistory("NZD"),
  ]);

  persistExchangeRates(rates).catch(console.error);

  return (
    <CurrencyCard
      rates={rates}
      history={{ JPY: jpyHistory, NZD: nzdHistory }}
      updated={rates.updated}
    />
  );
}
