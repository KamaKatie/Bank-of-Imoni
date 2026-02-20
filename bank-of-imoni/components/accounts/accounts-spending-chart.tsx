"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

type CashflowPoint = {
  month: string;
  inflow: number;
  outflow: number;
};

const chartConfig = {
  inflow: {
    label: "Inflow",
    color: "var(--chart-1)",
  },
  outflow: {
    label: "Outflow",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export default function AccountsLineChart({
  data,
}: {
  data: CashflowPoint[];
  accountName: string;
}) {
  return (
    <div>
      <ChartContainer config={chartConfig} className="h-full w-full">
        <LineChart data={data} margin={{ left: 12, right: 12, top: 20 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            dataKey="inflow"
            type="monotone"
            stroke={chartConfig.inflow.color} // Direct access if CSS vars fail
            strokeWidth={2}
            dot
          />
          <Line
            dataKey="outflow"
            type="monotone"
            stroke={chartConfig.outflow.color} // Direct access if CSS vars fail
            strokeWidth={2}
            dot
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
