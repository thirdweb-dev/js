"use client";

import { format } from "date-fns";
import { useMemo } from "react";
import { ThirdwebBarChart } from "@/components/blocks/charts/bar-chart";
import { TotalValueChartHeader } from "@/components/blocks/charts/chart-header";

export function X402RequestsChartCardUI(props: {
  stats: Array<{ requests: number; time: string }>;
  isPending: boolean;
  teamSlug: string;
  projectSlug: string;
  emptyChartState?: React.ReactElement | undefined;
}) {
  const total = useMemo(() => {
    return props.stats.reduce((acc, curr) => acc + curr.requests, 0);
  }, [props.stats]);

  return (
    <ThirdwebBarChart
      chartClassName="w-full h-[275px]"
      data={props.stats}
      config={{
        requests: {
          color: "hsl(var(--chart-1))",
          label: "Requests",
        },
      }}
      isPending={props.isPending}
      hideLabel={false}
      toolTipLabelFormatter={(label) => {
        return format(label, "MMM dd");
      }}
      toolTipValueFormatter={(value) => {
        return compactNumberFormatter.format(value as number);
      }}
      customHeader={
        <TotalValueChartHeader
          total={total}
          isPending={props.isPending}
          title="X402 Requests"
          viewMoreLink={`/team/${props.teamSlug}/${props.projectSlug}/x402`}
        />
      }
      emptyChartState={props.emptyChartState}
    />
  );
}

const compactNumberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 2,
});
