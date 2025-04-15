"use client";

import { ThirdwebAreaChart } from "@/components/blocks/charts/area-chart";
import { formatDate } from "date-fns";
import { InfoIcon } from "lucide-react";

export function RateGraph(props: {
  peakPercentage: number;
  currentRateLimit: number;
  data: { date: string; averageRate: number }[];
}) {
  return (
    <ThirdwebAreaChart
      chartClassName="aspect-[1.5] lg:aspect-[4]"
      header={{
        title: "Request Rate Over Time",
        description: "Request rate over the last 24 hours. All times in UTC.",
      }}
      // only show the footer if the peak usage is greater than 80%
      footer={
        props.peakPercentage > 80 ? (
          <div className="flex items-center justify-center gap-2">
            <InfoIcon className="h-4 w-4 text-muted-foreground" />
            <p className="text-muted-foreground text-xs">
              The red dashed line represents your current plan rate limit (
              {props.currentRateLimit} RPS)
            </p>
          </div>
        ) : undefined
      }
      config={{
        averageRate: {
          label: "Average RPS",
          color: "hsl(var(--chart-1))",
        },
      }}
      data={props.data
        .slice(1, -1)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map((v) => ({
          time: v.date,
          averageRate: Number(v.averageRate.toFixed(2)),
        }))}
      yAxis
      xAxis={{
        sameDay: true,
      }}
      hideLabel={false}
      toolTipLabelFormatter={(label) => {
        return formatDate(new Date(label), "MMM dd, HH:mm");
      }}
      // only show the upper limit if the peak usage is greater than 80%
      maxLimit={props.peakPercentage > 80 ? props.currentRateLimit : undefined}
      isPending={false}
    />
  );
}
