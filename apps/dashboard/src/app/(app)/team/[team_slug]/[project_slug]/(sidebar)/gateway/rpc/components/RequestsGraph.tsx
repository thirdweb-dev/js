"use client";

import { format } from "date-fns";
import { shortenLargeNumber } from "thirdweb/utils";
import type { RpcUsageTypeStats } from "@/api/analytics";
import { ThirdwebAreaChart } from "@/components/blocks/charts/area-chart";

export function RequestsGraph(props: { data: RpcUsageTypeStats[] }) {
  return (
    <ThirdwebAreaChart
      chartClassName="aspect-[1.5] lg:aspect-[4]"
      config={{
        requests: {
          color: "hsl(var(--chart-1))",
          label: "Count",
        },
      }}
      data={props.data
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .reduce(
          (acc, curr) => {
            const existingEntry = acc.find((e) => e.time === curr.date);
            if (existingEntry) {
              existingEntry.requests += curr.count;
            } else {
              acc.push({
                requests: curr.count,
                time: curr.date,
              });
            }
            return acc;
          },
          [] as { requests: number; time: string }[],
        )}
      header={{
        description: "Requests over time.",
        title: "RPC Requests",
      }}
      hideLabel={false}
      isPending={false}
      showLegend
      toolTipLabelFormatter={(label) => {
        return format(label, "MMM dd, HH:mm");
      }}
      toolTipValueFormatter={(value) => {
        return shortenLargeNumber(value as number);
      }}
      xAxis={{
        sameDay: true,
      }}
      yAxis
    />
  );
}
