"use client";

import { format } from "date-fns";
import { ThirdwebAreaChart } from "@/components/blocks/charts/area-chart";

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
      config={
        hasAnyRateLimited
          ? {
              includedCount: {
                color: "hsl(var(--chart-1))",
                label: "Successful Requests",
              },
              rateLimitedCount: {
                color: "hsl(var(--chart-4))",
                label: "Rate Limited Requests",
              },
            }
          : {
              includedCount: {
                color: "hsl(var(--chart-1))",
                label: "Successful Requests",
              },
            }
      }
      // @ts-expect-error - sending MORE data than expected is ok
      data={props.data
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map((v) => ({
          includedCount: Number(v.includedCount) + Number(v.overageCount),
          rateLimitedCount: Number(v.rateLimitedCount),
          time: v.date,
        }))}
      header={{
        description: "Requests over the last 24 hours.",
        title: "Requests Over Time",
      }}
      hideLabel={false}
      isPending={false}
      showLegend={hasAnyRateLimited}
      toolTipLabelFormatter={(label) => {
        return format(label, "MMM dd, HH:mm");
      }}
      xAxis={{
        showHour: true,
      }}
      yAxis
    />
  );
}
