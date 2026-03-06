"use client";

import { useMemo, useState, memo } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts";
import { useTransactionStats } from "@/hooks/use-transaction-stats";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TimeRange = "1y" | "2y" | "5y";

interface ChartDataItem {
  label: string;
  income: number;
  spending: number;
}

// Tailwind line colors mapped separately to satisfy ChartConfig
const chartColors: Record<"income" | "spending", string> = {
  income: "text-emerald-600",
  spending: "text-red-600",
};

const chartConfig = {
  income: { label: "Income", color: "currentColor" },
  spending: { label: "Spent", color: "currentColor" },
} satisfies ChartConfig;

const TimeRangeSelector = memo(function TimeRangeSelector({
  value,
  onChange,
}: {
  value: TimeRange;
  onChange: (v: TimeRange) => void;
}) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as TimeRange)}>
      <SelectTrigger className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex">
        <SelectValue />
      </SelectTrigger>

      <SelectContent className="rounded-xl">
        <SelectItem value="1y">Current year</SelectItem>
        <SelectItem value="2y">Last 2 years</SelectItem>
        <SelectItem value="5y">Last 5 years</SelectItem>
      </SelectContent>
    </Select>
  );
});

export default function CashflowChart() {
  const { stats } = useTransactionStats();
  const [range, setRange] = useState<TimeRange>("1y");

  const chartData: ChartDataItem[] = useMemo(() => {
    if (!stats.length) return [];

    const now = new Date();
    const currentYear = now.getFullYear();

    // 1 YEAR → MONTH VIEW
    if (range === "1y") {
      const months: ChartDataItem[] = Array.from({ length: 12 }, (_, i) => ({
        label: new Date(currentYear, i).toLocaleDateString("en-US", {
          month: "short",
        }),
        income: 0,
        spending: 0,
      }));

      for (const row of stats) {
        const d = new Date(row.month);
        if (d.getFullYear() !== currentYear) continue;
        const m = d.getMonth();
        months[m].income = Number(row.income);
        months[m].spending = Number(row.spending);
      }

      return months;
    }

    // YEAR VIEW
    const yearsToShow = range === "2y" ? 2 : 5;

    const years: ChartDataItem[] = [];
    for (let i = yearsToShow - 1; i >= 0; i--) {
      const year = currentYear - i;
      years.push({ label: String(year), income: 0, spending: 0 });
    }

    const yearMap = new Map(years.map((y) => [y.label, y]));
    for (const row of stats) {
      const d = new Date(row.month);
      const key = String(d.getFullYear());
      if (!yearMap.has(key)) continue;
      yearMap.get(key)!.income += Number(row.income);
      yearMap.get(key)!.spending += Number(row.spending);
    }

    return years;
  }, [stats, range]);

  const currency = new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  });

  return (
    <div className="grid flex-1 gap-2 w-full">
      <TimeRangeSelector value={range} onChange={setRange} />

      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[250px] w-full"
      >
        <LineChart data={chartData}>
          <CartesianGrid vertical={false} />

          {/* X-axis with dynamic color */}
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tick={({ x, y, payload, index }) => {
              const point = chartData[index];
              const color =
                point.income >= point.spending
                  ? chartColors.income
                  : chartColors.spending;
              return (
                <text x={x} y={y + 10} textAnchor="middle" className={color}>
                  {payload.value}
                </text>
              );
            }}
          />

          <YAxis hide />

          <ChartTooltip
            cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
            content={
              <ChartTooltipContent
                indicator="dot"
                labelFormatter={(label) => label}
                formatter={(value, name) => {
                  if (name === "income")
                    return `Income: ${currency.format(Number(value))}`;
                  if (name === "spending")
                    return `Spent: ${currency.format(Number(value))}`;
                  return currency.format(Number(value));
                }}
              />
            }
          />

          <Line
            type="monotone"
            dataKey="income"
            className={chartColors.income}
            stroke={chartConfig.income.color}
            strokeWidth={1}
            dot={false}
            activeDot={{ r: 2 }}
          />

          <Line
            type="monotone"
            dataKey="spending"
            className={chartColors.spending}
            stroke={chartConfig.spending.color}
            strokeWidth={1}
            dot={false}
            activeDot={{ r: 2 }}
          />

          <ChartLegend content={<ChartLegendContent />} />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
