import { getExchangeRates } from "@/lib/exchange-rates";
import { persistExchangeRates } from "@/lib/exchange-history";

export async function GET() {
  const rates = await getExchangeRates();
  await persistExchangeRates(rates);

  return Response.json({ ok: true });
}
