"use client";

import { ThirdwebAreaChart } from "@/components/blocks/charts/area-chart";
import { format } from "date-fns";

export function RateGraph(props: {
  peakPercentage: number;
  currentRateLimit: number;
  data: { date: string; averageRate: string; peakRPS: string }[];
}) {
  return (
    <ThirdwebAreaChart
      chartClassName="aspect-[1.5] lg:aspect-[4]"
      header={{
        title: "Request Rate Over Time",
        description: "Request rate over the last 24 hours.",
      }}
      config={
        props.peakPercentage > 80
          ? {
              averageRate: {
                label: "Average RPS",
                color: "hsl(var(--chart-1))",
              },
              peakRPS: {
                label: "Peak RPS",
                color: "hsl(var(--chart-2))",
              },
              maxLine: {
                label: "Plan Rate Limit",
              },
            }
          : {
              averageRate: {
                label: "Average RPS",
                color: "hsl(var(--chart-1))",
              },
              peakRPS: {
                label: "Peak RPS",
                color: "hsl(var(--chart-2))",
              },
            }
      }
      // @ts-expect-error - maxLine is always sent but not always rendered, this is OK
      data={props.data
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map((v) => ({
          time: v.date,
          averageRate: Number(Number(v.averageRate).toFixed(2)),
          peakRPS: Number(v.peakRPS),
          maxLine: props.currentRateLimit,
        }))}
      yAxis
      xAxis={{
        sameDay: true,
      }}
      showLegend
      hideLabel={false}
      toolTipLabelFormatter={(label) => {
        return format(label, "MMM dd, HH:mm");
      }}
      isPending={false}
    />
  );
}
