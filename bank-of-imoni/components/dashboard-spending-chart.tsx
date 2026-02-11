"use client";

import { useEffect, useMemo, useState } from "react";
import useTransactions from "@/hooks/use-transactions";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChartDataItem {
  date: string; // YYYY-MM
  income: number;
  spending: number;
}

type TimeRange = "1y" | "2y" | "5y";

export default function SpendingChart() {
  const [timeRange, setTimeRange] = useState<TimeRange>("1y");
  const [filteredData, setFilteredData] = useState<ChartDataItem[]>([]);

  const { transactions } = useTransactions();

  const chartConfig = {
    income: {
      label: "Income",
      color: "var(--chart-1)",
    },
    spending: {
      label: "Spending",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  const chartData: ChartDataItem[] = useMemo(() => {
    if (!transactions.length) return [];

    const byMonth = new Map<string, ChartDataItem>();

    for (const tx of transactions) {
      const date = new Date(tx.date);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1,
      ).padStart(2, "0")}`;

      if (!byMonth.has(monthKey)) {
        byMonth.set(monthKey, {
          date: monthKey,
          income: 0,
          spending: 0,
        });
      }

      const entry = byMonth.get(monthKey)!;
      const amount = Number(tx.amount);

      if (tx.type === "income") {
        entry.income += amount;
      } else {
        entry.spending += Math.abs(amount);
      }
    }

    return Array.from(byMonth.values()).sort((a, b) =>
      a.date.localeCompare(b.date),
    );
  }, [transactions]);

  useEffect(() => {
    if (!chartData.length) {
      setFilteredData([]);
      return;
    }

    const now = new Date();
    const years = timeRange === "1y" ? 1 : timeRange === "2y" ? 2 : 5;

    const startDate = new Date(
      now.getFullYear() - years + 1,
      now.getMonth(),
      1,
    );

    const filtered = chartData.filter((item) => {
      const [year, month] = item.date.split("-").map(Number);
      const itemDate = new Date(year, month - 1, 1);
      return itemDate >= startDate;
    });

    setFilteredData(filtered);
  }, [timeRange, chartData]);

  return (
    <div className="grid flex-1 gap-2 p-5">
      <Select
        value={timeRange}
        onValueChange={(v) => setTimeRange(v as TimeRange)}
      >
        <SelectTrigger
          className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
          aria-label="Select time range"
        >
          <SelectValue placeholder="Last year" />
        </SelectTrigger>

        <SelectContent className="rounded-xl">
          <SelectItem value="1y">Last year</SelectItem>
          <SelectItem value="2y">Last 2 years</SelectItem>
          <SelectItem value="5y">Last 5 years</SelectItem>
        </SelectContent>
      </Select>

      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[250px] w-full"
      >
        <AreaChart data={filteredData}>
          <defs>
            <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-income)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-income)"
                stopOpacity={0.1}
              />
            </linearGradient>

            <linearGradient id="fillSpending" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-spending)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-spending)"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>

          <CartesianGrid vertical={false} />

          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={24}
            tickFormatter={(value) => {
              const [year, month] = value.split("-");
              return new Date(
                Number(year),
                Number(month) - 1,
              ).toLocaleDateString("en-US", {
                month: "short",
                year: "2-digit",
              });
            }}
          />

          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                indicator="dot"
                labelFormatter={(value) => {
                  const [year, month] = value.split("-");
                  return new Date(
                    Number(year),
                    Number(month) - 1,
                  ).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  });
                }}
              />
            }
          />

          <Area
            dataKey="spending"
            type="natural"
            fill="url(#fillSpending)"
            stroke="var(--color-spending)"
            stackId="a"
          />

          <Area
            dataKey="income"
            type="natural"
            fill="url(#fillIncome)"
            stroke="var(--color-income)"
            stackId="a"
          />

          <ChartLegend content={<ChartLegendContent />} />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
