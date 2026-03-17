"use client";

import * as React from "react";
import { Pie, PieChart, Cell, Label } from "recharts";
import { DynamicIcon } from "lucide-react/dynamic";
import { useUserTransactions } from "@/hooks/use-user-transactions";

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
  const { transactions } = useUserTransactions();
  const now = React.useMemo(() => new Date(), []);
  const month = now.getMonth();
  const year = now.getFullYear();

  const processedData = React.useMemo(() => {
    if (!transactions.length) return { coloredExpenses: [], totalAmount: 0 };

    const aggregated: Record<string, { amount: number; icon?: string | null }> =
      {};

    transactions
      .filter(
        (tx: any) =>
          tx.type !== "income" &&
          new Date(tx.date).getMonth() === month &&
          new Date(tx.date).getFullYear() === year,
      )
      .forEach((tx: any) => {
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

    const coloredExpenses = Object.entries(aggregated).map(
      ([category, { amount, icon }]) => {
        const percentage = totalAmount > 0 ? (amount / totalAmount) * 100 : 0;
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

  const topCategories = React.useMemo(() => {
    return [...coloredExpenses].sort((a, b) => b.amount - a.amount).slice(0, 5);
  }, [coloredExpenses]);

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
    <div className="flex flex-col items-center w-full mx-auto">
      <div className="w-full">
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
                      <span className="font-semibold text-blue-600">
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

      <div className="w-full p-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider pb-2">
          Top Categories
        </h3>
        <div className="grid gap-2">
          {topCategories.map((item) => (
            <div
              key={item.category}
              className="flex items-center justify-between p-3 rounded-lg bg-muted border"
            >
              <div className="flex items-center gap-3">
                {/* 
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.fill }}
                />*/}
                {item.icon && <DynamicIcon name={item.icon as any} size={16} />}
                <span className="text-sm">{item.category}</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">
                  ¥{item.amount.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
