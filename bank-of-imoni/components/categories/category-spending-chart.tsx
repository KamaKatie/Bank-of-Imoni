"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import useTransactions from "@/hooks/use-transactions";

const chartConfig = {
  amount: {
    label: "Total Spent",
    color: "var(--custom-a0)",
  },
} satisfies ChartConfig;

interface CategorySpendingChartProps {
  categoryId?: string;
}

export default function CategorySpendingChart({
  categoryId,
}: CategorySpendingChartProps) {
  const { transactions } = useTransactions();

  const chartData = React.useMemo(() => {
    if (!categoryId || !transactions.length) return [];

    const filtered = transactions.filter(
      (t: any) => t.category === categoryId && !t.deleted_at,
    );

    const monthlyGroups: Record<
      string,
      { month: string; amount: number; count: number; rawDate: Date }
    > = {};

    filtered.forEach((t: any) => {
      const date = new Date(t.date);
      const monthLabel = date.toLocaleString("default", { month: "short" });
      const yearLabel = date.getFullYear();
      const key = `${monthLabel} ${yearLabel}`;

      if (!monthlyGroups[key]) {
        monthlyGroups[key] = {
          month: key,
          amount: 0,
          count: 0,
          rawDate: new Date(date.getFullYear(), date.getMonth(), 1),
        };
      }

      monthlyGroups[key].amount += Number(t.amount);
      monthlyGroups[key].count += 1;
    });

    return Object.values(monthlyGroups)
      .sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime())
      .map(({ month, amount, count }) => ({
        month,
        amount,
        count,
        average: amount / count,
      }));
  }, [transactions, categoryId]);

  if (chartData.length === 0)
    return (
      <Card className="flex items-center justify-center h-[200px] text-muted-foreground">
        No transaction data for this category.
      </Card>
    );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Cashflow</CardTitle>
        <CardDescription>Total spending</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full h-[200px]">
          <BarChart accessibilityLayer data={chartData} margin={{ top: 25 }}>
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              fontSize={12}
              className="fill-muted-foreground"
            />

            <YAxis hide domain={[0, "dataMax + 2000"]} />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, name, item) => {
                    const { count, average, amount } = item.payload;

                    // We only want to render the custom tooltip block once
                    if (name !== "amount") return null;

                    return (
                      <div className="flex flex-col gap-1.5 min-w-[140px]">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-muted-foreground">Total</span>
                          <span className="font-bold text-foreground">
                            ¥{amount.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-muted-foreground">
                            Transactions
                          </span>
                          <span className="font-medium">{count}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4 border-t pt-1 mt-1">
                          <span className="text-muted-foreground">Average</span>
                          <span className="font-medium text-emerald-600">
                            ¥{Math.round(average).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    );
                  }}
                />
              }
            />

            <Bar
              dataKey="amount"
              fill="var(--color-amount)"
              radius={6}
              barSize={40}
            >
              <LabelList
                dataKey="amount"
                position="top"
                offset={12}
                className="fill-foreground font-medium"
                fontSize={12}
                formatter={(value: number) => `¥${value.toLocaleString()}`}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
