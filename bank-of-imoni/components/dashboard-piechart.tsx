"use client";

import * as React from "react";
import { Label, Pie, PieChart, Cell } from "recharts";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart";
import { Spinner } from "@/components/ui/spinner";

interface Expense {
  category: string;
  amount: number;
  fill: string;
  icon?: string;
}

export default function CurrentMonthExpensesChart() {
  const [expenses, setExpenses] = React.useState<Expense[]>([]);
  const [loading, setLoading] = React.useState(true);

  const [monthInfo, setMonthInfo] = React.useState<{
    monthName: string;
    monthNumber: number;
    year: number;
  } | null>(null);

  React.useEffect(() => {
    const now = new Date();
    setMonthInfo({
      monthName: now.toLocaleString("default", { month: "long" }),
      monthNumber: now.getMonth() + 1,
      year: now.getFullYear(),
    });
  }, []);

  React.useEffect(() => {
    if (!monthInfo) return;

    async function fetchExpenses() {
      const supabase = createClient();

      // Fetch transactions with category id
      const { data: transactions, error: txError } = await supabase
        .from("transactions")
        .select("amount, category")
        .gte("date", `${monthInfo!.year}-${monthInfo!.monthNumber}-01`)
        .lt(
          "date",
          `${
            monthInfo!.monthNumber === 12
              ? monthInfo!.year + 1
              : monthInfo!.year
          }-${monthInfo!.monthNumber === 12 ? 1 : monthInfo!.monthNumber + 1}-01`,
        );

      if (txError) {
        console.error("Error fetching transactions:", txError);
        setLoading(false);
        return;
      }

      // Fetch all categories
      const { data: categories, error: catError } = await supabase
        .from("categories")
        .select("id, name, data_url");

      if (catError) {
        console.error("Error fetching categories:", catError);
        setLoading(false);
        return;
      }

      // Aggregate transactions by category
      const aggregated: Record<string, { amount: number; icon?: string }> = {};
      transactions?.forEach((tx) => {
        const cat = categories?.find((c) => c.id === tx.category);
        const categoryName = cat?.name || "Uncategorized";
        if (!aggregated[categoryName]) {
          aggregated[categoryName] = { amount: 0, icon: cat?.data_url };
        }
        aggregated[categoryName].amount += Number(tx.amount);
      });

      const chartData: Expense[] = Object.entries(aggregated).map(
        ([category, { amount, icon }]) => ({
          category,
          amount,
          icon,
          fill: "#00FFA3", // placeholder, will generate gradient later
        }),
      );

      setExpenses(chartData);
      setLoading(false);
    }

    fetchExpenses();
  }, [monthInfo]);

  if (loading || !monthInfo)
    return (
      <div className="flex justify-center">
        <Spinner />
      </div>
    );

  const totalAmount = expenses.reduce((sum, item) => sum + item.amount, 0);

  // Generate gradient colors dynamically
  const minGreen = 120;
  const maxGreen = 200;
  const minBlue = 180;
  const maxBlue = 255;

  const coloredExpenses = expenses.map((exp) => {
    const ratio = exp.amount / totalAmount;
    const green = Math.round(minGreen + (maxGreen - minGreen) * ratio);
    const blue = Math.round(minBlue + (maxBlue - minBlue) * ratio);
    const fill = `rgb(0, ${green}, ${blue})`;
    return { ...exp, fill };
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
        {monthInfo.monthName} - {monthInfo.year}
      </p>

      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[250px] mb-2"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={({ payload }) => {
              if (!payload || payload.length === 0) return null;
              const entry = payload[0].payload;
              return (
                <div className="flex items-center gap-2 bg-white p-2 rounded shadow">
                  {entry.icon && (
                    <Image
                      src={entry.icon}
                      alt={entry.category}
                      width={20}
                      height={20}
                    />
                  )}
                  <div>
                    <div className="font-semibold">{entry.category}</div>
                    <div>¥{entry.amount}</div>
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
            outerRadius={90}
            strokeWidth={1}
          >
            {coloredExpenses.map((entry, index) => (
              <Cell key={index} fill={entry.fill} />
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
                        className="fill-foreground text-2xl font-bold"
                      >
                        ¥{totalAmount}
                      </tspan>
                    </text>
                  );
                }
                return null;
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    </div>
  );
}
