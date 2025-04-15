"use client";

import { ThirdwebAreaChart } from "@/components/blocks/charts/area-chart";
import { formatDate } from "date-fns";

export function CountGraph(props: {
  peakPercentage: number;
  currentRateLimit: number;
  data: {
    date: string;
    includedCount: number;
    overageCount: number;
    rateLimitedCount: number;
  }[];
}) {
  return (
    <ThirdwebAreaChart
      chartClassName="aspect-[1.5] lg:aspect-[4]"
      header={{
        title: "Requests Over Time",
        description: "Requests over the last 24 hours. All times in UTC.",
      }}
      config={{
        includedCount: {
          label: "Successful Requests",
          color: "hsl(var(--chart-1))",
        },
        rateLimitedCount: {
          label: "Rate Limited Requests",
          color: "hsl(var(--chart-4))",
        },
      }}
      showLegend
      yAxis
      xAxis={{
        sameDay: true,
      }}
      hideLabel={false}
      toolTipLabelFormatter={(label) => {
        return formatDate(new Date(label), "MMM dd, HH:mm");
      }}
      data={props.data
        .slice(1, -1)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map((v) => ({
          time: v.date,
          includedCount: v.includedCount + v.overageCount,
          rateLimitedCount: v.rateLimitedCount,
        }))}
      isPending={false}
    />
  );
}
