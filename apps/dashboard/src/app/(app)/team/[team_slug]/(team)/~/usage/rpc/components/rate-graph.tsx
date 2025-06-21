"use client";

import { format } from "date-fns";
import { ThirdwebAreaChart } from "@/components/blocks/charts/area-chart";

export function RateGraph(props: {
  peakPercentage: number;
  currentRateLimit: number;
  data: { date: string; averageRate: string; peakRPS: string }[];
}) {
  return (
    <ThirdwebAreaChart
      chartClassName="aspect-[1.5] lg:aspect-[4]"
      config={
        props.peakPercentage > 80
          ? {
              averageRate: {
                color: "hsl(var(--chart-1))",
                label: "Average RPS",
              },
              maxLine: {
                label: "Plan Rate Limit",
              },
              peakRPS: {
                color: "hsl(var(--chart-2))",
                label: "Peak RPS",
              },
            }
          : {
              averageRate: {
                color: "hsl(var(--chart-1))",
                label: "Average RPS",
              },
              peakRPS: {
                color: "hsl(var(--chart-2))",
                label: "Peak RPS",
              },
            }
      }
      // @ts-expect-error - maxLine is always sent but not always rendered, this is OK
      data={props.data
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map((v) => ({
          averageRate: Number(Number(v.averageRate).toFixed(2)),
          maxLine: props.currentRateLimit,
          peakRPS: Number(v.peakRPS),
          time: v.date,
        }))}
      header={{
        description: "Request rate over the last 24 hours.",
        title: "Request Rate Over Time",
      }}
      hideLabel={false}
      isPending={false}
      showLegend
      toolTipLabelFormatter={(label) => {
        return format(label, "MMM dd, HH:mm");
      }}
      xAxis={{
        sameDay: true,
      }}
      yAxis
    />
  );
}
