import { format } from "date-fns";
import { useMemo } from "react";
import { ThirdwebAreaChart } from "@/components/blocks/charts/area-chart";
import type { ChartConfig } from "@/components/ui/chart";
import type { WebhookLatencyStats } from "@/types/analytics";

interface WebhookLatencyChartUIProps {
  data: WebhookLatencyStats[];
  isPending: boolean;
}

export function WebhookLatencyChartUI({
  data,
  isPending,
}: WebhookLatencyChartUIProps) {
  // Process latency data for charts
  const latencyChartData = useMemo(() => {
    if (!data.length) return [];

    return data
      .map((item) => ({
        p50: item.p50LatencyMs,
        p90: item.p90LatencyMs,
        p99: item.p99LatencyMs,
        time: new Date(item.date).getTime(),
      }))
      .sort((a, b) => a.time - b.time);
  }, [data]);

  // Chart configuration
  const latencyChartConfig: ChartConfig = {
    p50: {
      color: "hsl(var(--chart-1))",
      label: "P50 Latency",
    },
    p90: {
      color: "hsl(var(--chart-2))",
      label: "P90 Latency",
    },
    p99: {
      color: "hsl(var(--chart-3))",
      label: "P99 Latency",
    },
  };

  return (
    <ThirdwebAreaChart
      chartClassName="h-[220px] w-full aspect-auto"
      className="w-full"
      config={latencyChartConfig}
      data={latencyChartData}
      header={{
        description: "Webhook response times in milliseconds",
        title: "Response Latency",
      }}
      isPending={isPending}
      showLegend
      toolTipLabelFormatter={(label) =>
        format(new Date(Number.parseInt(label as string)), "MMM dd, yyyy HH:mm")
      }
      toolTipValueFormatter={(value) => `${value}ms`}
    />
  );
}
