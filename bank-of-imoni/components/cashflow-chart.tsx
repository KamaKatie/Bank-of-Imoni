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

const chartConfig = {
  income: {
    label: "Income",
    color: "#059669", // emerald-600
  },
  spending: {
    label: "Spent",
    color: "#dc2626", // red-600
  },
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
      <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto">
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
    if (!stats || !stats.length) return [];

    const now = new Date();
    const currentYear = now.getFullYear();

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
        if (months[m]) {
          months[m].income = Number(row.income);
          months[m].spending = Number(row.spending);
        }
      }
      return months;
    }

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
      const target = yearMap.get(key);
      if (target) {
        target.income += Number(row.income);
        target.spending += Number(row.spending);
      }
    }

    return years;
  }, [stats, range]);

  const currency = new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  });

  return (
    <div className="grid flex-1 gap-4 p-4 w-full">
      <div className="flex items-center">
        <TimeRangeSelector value={range} onChange={setRange} />
      </div>

      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[250px] w-full"
      >
        <LineChart data={chartData} margin={{ left: 12, right: 12, top: 10 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={1} />

          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tickMargin={12}
            interval={0}
            tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
          />

          <YAxis hide domain={["auto", "auto"]} />

          <ChartTooltip
            cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
            content={
              <ChartTooltipContent
                indicator="dot"
                formatter={(value, name) => (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {chartConfig[name as keyof typeof chartConfig]?.label}:
                    </span>
                    <span>{currency.format(Number(value))}</span>
                  </div>
                )}
              />
            }
          />

          <Line
            type="monotone"
            dataKey="income"
            stroke={chartConfig.income.color}
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 3, strokeWidth: 0 }}
          />

          <Line
            type="monotone"
            dataKey="spending"
            stroke={chartConfig.spending.color}
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 3, strokeWidth: 0 }}
          />

          <ChartLegend content={<ChartLegendContent />} />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
