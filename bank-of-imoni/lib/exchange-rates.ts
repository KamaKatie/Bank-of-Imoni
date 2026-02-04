export type ExchangeRates = {
  NZD: number;
  USD: number;
  JPY: number;
  updated: string;
};

export async function getExchangeRates(): Promise<ExchangeRates> {
  const res = await fetch(
    `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/latest/USD`,
    {
      next: {
        revalidate: 60 * 60 * 12, // 12 hours
      },
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch exchange rates");
  }

  const data = await res.json();

  const NZD = data.conversion_rates.NZD;
  const USD = 1;
  const JPY = data.conversion_rates.JPY;

  const updatedDate = new Date(data.time_last_update_utc);

  // Date formatting
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(updatedDate);

  return {
    NZD,
    USD,
    JPY,
    updated: formattedDate,
  };
}
