"use client";

import { Line, LineChart, YAxis } from "recharts";
import { ChartContainer } from "@/components/ui/chart";

type SparklineProps = {
  data: { t: string; v: number }[];
};

export function Sparkline({ data }: SparklineProps) {
  if (!data || data.length < 2) return <div className="h-6 w-20" />;

  // Determine if trend is up or down
  const up = data[data.length - 1].v >= data[0].v;

  return (
    <ChartContainer
      config={{
        lineValue: {
          label: "Rate",
          color: up ? "rgb(34 197 94)" : "rgb(239 68 68)", // Simple green/red fallback
        },
      }}
      className="h-6 w-24"
    >
      <LineChart data={data}>
        <YAxis domain={["dataMin - 0.01", "dataMax + 0.01"]} hide />
        <Line
          type="monotone"
          dataKey="v"
          stroke="var(--color-lineValue)"
          strokeWidth={2}
          dot={false}
          animationDuration={500}
        />
      </LineChart>
    </ChartContainer>
  );
}
