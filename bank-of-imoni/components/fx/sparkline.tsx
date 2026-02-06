"use client";

import { Line, LineChart, YAxis } from "recharts";
import { ChartContainer } from "@/components/ui/chart";

type SparklineProps = {
  data: { t: string; v: number }[];
};

export function Sparkline({ data }: SparklineProps) {
  if (!data || data.length < 2) return <div className="h-6 w-24" />;

  const latest = data[data.length - 1].v;
  const yesterday = data[data.length - 2].v;
  const change = latest - yesterday;

  const isDecrease = change < 0;

  return (
    <div className="flex items-center gap-2">
      <ChartContainer
        config={{
          lineValue: {
            label: "Rate",
            color: "rgb(156 163 175)", // grey-400
          },
        }}
        className="h-6 w-20"
      >
        <LineChart data={data}>
          <YAxis domain={["dataMin - 0.01", "dataMax + 0.01"]} hide />
          <Line
            type="monotone"
            dataKey="v"
            stroke="var(--color-lineValue)"
            strokeWidth={1}
            dot={false}
            animationDuration={500}
          />
        </LineChart>
      </ChartContainer>

      <span
        className={`flex items-center gap-0.5 text-xs font-medium ${
          isDecrease ? "text-emerald-500" : "text-red-500"
        }`}
      >
        <span className="leading-none">{isDecrease ? "▼" : "▲"}</span>
        <span>
          {change > 0 ? "+" : ""}
          {change.toFixed(2)}
        </span>
      </span>
    </div>
  );
}
