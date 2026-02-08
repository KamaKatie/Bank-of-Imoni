"use client";

import { TrendingUp } from "lucide-react";
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
    <Card>
      <CardHeader>
        <CardTitle>Cashflow</CardTitle>
        <CardDescription>Last 6 months</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart data={data} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="inflow"
              type="monotone"
              stroke="var(--color-inflow)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="outflow"
              type="monotone"
              stroke="var(--color-outflow)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>

      <CardFooter>
        <div className="text-sm text-muted-foreground">Placeholder </div>
      </CardFooter>
    </Card>
  );
}
