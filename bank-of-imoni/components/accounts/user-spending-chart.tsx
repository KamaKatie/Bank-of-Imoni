"use client";

import * as React from "react";
import { Pie, PieChart, Cell, Label } from "recharts";
import { DynamicIcon } from "lucide-react/dynamic";

import useTransactions from "@/hooks/use-transactions";
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart";

interface Expense {
  category: string;
  amount: number;
  percentage: number;
  fill: string;
  icon?: string | null;
}

export default function UserSpendingChartByCategory() {
  const { transactions } = useTransactions();

  const now = React.useMemo(() => new Date(), []);
  const month = now.getMonth();
  const year = now.getFullYear();

  const processedData = React.useMemo(() => {
    if (!transactions.length) return { coloredExpenses: [], totalAmount: 0 };

    const aggregated: Record<string, { amount: number; icon?: string | null }> =
      {};

    // 1. Filter and Aggregate
    transactions
      .filter(
        (tx) =>
          tx.type !== "income" &&
          new Date(tx.date).getMonth() === month &&
          new Date(tx.date).getFullYear() === year,
      )
      .forEach((tx) => {
        const categoryName = tx.categories?.name ?? "Uncategorized";
        const icon = tx.categories?.icon;

        if (!aggregated[categoryName]) {
          aggregated[categoryName] = { amount: 0, icon };
        }
        aggregated[categoryName].amount += Number(tx.amount);
      });

    const totalAmount = Object.values(aggregated).reduce(
      (sum, item) => sum + item.amount,
      0,
    );

    // 2. Map to final Expense format with Percentage and Colors
    const coloredExpenses = Object.entries(aggregated).map(
      ([category, { amount, icon }]) => {
        const percentage = totalAmount > 0 ? (amount / totalAmount) * 100 : 0;

        // Dynamic coloring logic based on ratio
        const ratio = amount / totalAmount;
        const green = Math.round(120 + (200 - 120) * ratio);
        const blue = Math.round(180 + (255 - 180) * ratio);

        return {
          category,
          amount,
          percentage,
          icon: icon ?? undefined,
          fill: `rgb(0, ${green}, ${blue})`,
        };
      },
    );

    return { coloredExpenses, totalAmount };
  }, [transactions, month, year]);

  const { coloredExpenses, totalAmount } = processedData;

  const chartConfig = {
    amount: { label: "Amount" },
    ...coloredExpenses.reduce(
      (acc, item) => ({
        ...acc,
        [item.category]: { label: item.category, color: item.fill },
      }),
      {},
    ),
  } satisfies ChartConfig;

  return (
    <div className="flex flex-col items-center">
      <p className="text-center font-medium mb-4">
        Monthly Spending by Category
      </p>

      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square w-60"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={({ payload }) => {
              if (!payload?.length) return null;
              const entry = payload[0].payload as Expense;
              return (
                <div className="flex flex-col gap-1 bg-white p-3 rounded-lg shadow-lg border border-slate-100">
                  <div className="flex items-center gap-2 border-b pb-1 mb-1">
                    {entry.icon && (
                      <DynamicIcon name={entry.icon as any} size={16} />
                    )}
                    <span className="font-bold text-slate-800">
                      {entry.category}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4 text-sm">
                    <span className="text-slate-500">Amount:</span>
                    <span className="font-mono">
                      ¥{entry.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4 text-sm">
                    <span className="text-slate-500">Share:</span>
                    <span className="font-semibold text-emerald-600">
                      {entry.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              );
            }}
          />

          <Pie
            data={coloredExpenses}
            dataKey="amount"
            nameKey="category"
            innerRadius={70}
            outerRadius={100}
            strokeWidth={2}
          >
            {coloredExpenses.map((e, i) => (
              <Cell key={`cell-${i}`} fill={e.fill} />
            ))}
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-slate-800 text-xl font-bold"
                      >
                        ¥{totalAmount.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 20}
                        className="fill-slate-500 text-xs uppercase"
                      >
                        Total Spent
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    </div>
  );
}
