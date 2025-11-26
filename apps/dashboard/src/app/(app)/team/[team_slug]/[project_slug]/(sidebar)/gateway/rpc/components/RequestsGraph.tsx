"use client";

import { differenceInCalendarDays, format } from "date-fns";
import { useMemo } from "react";
import type { RpcUsageTypeStats } from "@/api/analytics";
import {
  ThirdwebAreaChart,
  TotalValueChartHeader,
} from "@/components/blocks/charts/area-chart";

export function RPCRequestsChartUI(props: {
  data: RpcUsageTypeStats[];
  viewMoreLink: string | undefined;
}) {
  const total = useMemo(() => {
    return props.data.reduce((acc, curr) => acc + curr.count, 0);
  }, [props.data]);

  const showBreakdownByHour = useMemo(() => {
    if (props.data.length === 0) return true;
    const firstData = props.data[0];
    const lastData = props.data[props.data.length - 1];
    if (!firstData || !lastData) return true;
    const firstDate = new Date(firstData.date);
    const lastDate = new Date(lastData.date);
    return Math.abs(differenceInCalendarDays(lastDate, firstDate)) < 2;
  }, [props.data]);

  return (
    <ThirdwebAreaChart
      chartClassName="aspect-auto h-[275px]"
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
      customHeader={
        <TotalValueChartHeader
          total={total}
          isPending={false}
          title="RPC Requests"
          viewMoreLink={props.viewMoreLink}
        />
      }
      hideLabel={false}
      isPending={false}
      toolTipLabelFormatter={(label) => {
        if (showBreakdownByHour) {
          return format(label, "MMM dd, HH:mm");
        }
        return format(label, "MMM dd");
      }}
      toolTipValueFormatter={(value) => {
        return compactNumberFormatter.format(value as number);
      }}
      xAxis={{
        showHour: showBreakdownByHour,
      }}
    />
  );
}

const compactNumberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 2,
});
