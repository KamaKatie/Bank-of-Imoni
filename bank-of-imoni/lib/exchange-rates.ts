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
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch exchange rates");
  }

  const data = await res.json();

  const updatedDate = new Date(data.time_last_update_utc);

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(updatedDate);

  return {
    USD: 1,
    JPY: data.conversion_rates.JPY,
    NZD: data.conversion_rates.NZD,
    updated: formattedDate,
  };
}
