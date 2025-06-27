"use client";

import { ThirdwebAreaChart } from "@/components/blocks/charts/area-chart";
import type { ChartConfig } from "@/components/ui/chart";

interface LatencyChartProps {
  data: Array<{
    time: string;
    p50LatencyMs: number;
    p90LatencyMs: number;
    p99LatencyMs: number;
  }>;
  isPending: boolean;
}

const latencyChartConfig = {
  p50LatencyMs: {
    color: "hsl(142, 76%, 36%)", // Green for best performance
    label: "P50",
  },
  p90LatencyMs: {
    color: "hsl(45, 93%, 47%)", // Yellow for warning level
    label: "P90",
  },
  p99LatencyMs: {
    color: "hsl(0, 84%, 60%)", // Red for critical level
    label: "P99",
  },
} satisfies ChartConfig;

export function LatencyChart({ data, isPending }: LatencyChartProps) {
  return (
    <ThirdwebAreaChart
      chartClassName="h-[500px] w-full"
      config={latencyChartConfig}
      data={data}
      header={{
        description: "Latency metrics for the selected webhook",
        title: "Latency",
      }}
      hideLabel={false}
      isPending={isPending}
      showLegend={true}
      toolTipValueFormatter={(value) => `${value}ms`}
      xAxis={{ sameDay: false }}
    />
  );
}
