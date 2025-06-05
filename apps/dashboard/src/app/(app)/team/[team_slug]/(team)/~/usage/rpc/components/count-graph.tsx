"use client";

import { ThirdwebAreaChart } from "@/components/blocks/charts/area-chart";
import { formatDate } from "date-fns";

export function CountGraph(props: {
  peakPercentage: number;
  currentRateLimit: number;
  data: {
    date: string;
    includedCount: string;
    overageCount: string;
    rateLimitedCount: string;
  }[];
}) {
  const hasAnyRateLimited = props.data.some(
    (v) => Number(v.rateLimitedCount) > 0,
  );
  return (
    <ThirdwebAreaChart
      chartClassName="aspect-[1.5] lg:aspect-[4]"
      header={{
        title: "Requests Over Time",
        description: "Requests over the last 24 hours.",
      }}
      config={
        hasAnyRateLimited
          ? {
              includedCount: {
                label: "Successful Requests",
                color: "hsl(var(--chart-1))",
              },
              rateLimitedCount: {
                label: "Rate Limited Requests",
                color: "hsl(var(--chart-4))",
              },
            }
          : {
              includedCount: {
                label: "Successful Requests",
                color: "hsl(var(--chart-1))",
              },
            }
      }
      showLegend={hasAnyRateLimited}
      yAxis
      xAxis={{
        sameDay: true,
      }}
      hideLabel={false}
      toolTipLabelFormatter={(label) => {
        return formatDate(label, "MMM dd, HH:mm");
      }}
      // @ts-expect-error - sending MORE data than expected is ok
      data={props.data
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map((v) => ({
          time: v.date,
          includedCount: Number(v.includedCount) + Number(v.overageCount),
          rateLimitedCount: Number(v.rateLimitedCount),
        }))}
      isPending={false}
    />
  );
}
