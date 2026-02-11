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
  fill: string;
  icon?: string;
}

export default function CurrentMonthExpensesChart() {
  const { transactions } = useTransactions();

  const now = React.useMemo(() => new Date(), []);
  const monthName = now.toLocaleString("default", { month: "long" });
  const month = now.getMonth();
  const year = now.getFullYear();

  const expenses = React.useMemo<Expense[]>(() => {
    if (!transactions.length) return [];

    const aggregated: Record<string, { amount: number; icon?: string }> = {};

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

    return Object.entries(aggregated).map(([category, { amount, icon }]) => ({
      category,
      amount,
      icon,
      fill: "#00FFA3", // placeholder
    }));
  }, [transactions, month, year]);

  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

  const coloredExpenses = expenses.map((exp) => {
    const ratio = exp.amount / totalAmount;
    const green = Math.round(120 + (200 - 120) * ratio);
    const blue = Math.round(180 + (255 - 180) * ratio);
    return { ...exp, fill: `rgb(0, ${green}, ${blue})` };
  });

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
    <div>
      <p className="text-center">
        {monthName} – {year}
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
              const entry = payload[0].payload;
              return (
                <div className="flex items-center gap-2 bg-white p-2 rounded shadow">
                  {entry.icon && <DynamicIcon name={entry.icon} />}
                  <div>
                    <div className="font-semibold">{entry.category}</div>
                    <div>¥{entry.amount.toLocaleString()}</div>
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
          >
            {coloredExpenses.map((e, i) => (
              <Cell key={i} fill={e.fill} />
            ))}

            <Label
              content={({ viewBox }) =>
                viewBox && "cx" in viewBox ? (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-foreground text-xl font-bold"
                  >
                    ¥{totalAmount.toLocaleString()}
                  </text>
                ) : null
              }
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    </div>
  );
}
