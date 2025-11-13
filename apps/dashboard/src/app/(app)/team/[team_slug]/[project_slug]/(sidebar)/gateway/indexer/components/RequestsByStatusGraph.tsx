"use client";
import { format } from "date-fns";
import { useMemo } from "react";
import { shortenLargeNumber } from "thirdweb/utils";
import type { InsightStatusCodeStats } from "@/api/analytics";
import { EmptyChartState } from "@/components/analytics/empty-chart-state";
import { ThirdwebBarChart } from "@/components/blocks/charts/bar-chart";
import type { ChartConfig } from "@/components/ui/chart";

type ChartData = Record<string, number> & {
  time: string; // human readable date
};
const defaultLabel = 200;

export function RequestsByStatusGraph(props: {
  data: InsightStatusCodeStats[];
  isPending: boolean;
  title: string;
  description: string;
}) {
  const topStatusCodesToShow = 10;

  const { chartConfig, chartData } = useMemo(() => {
    const _chartConfig: ChartConfig = {};
    const _chartDataMap: Map<string, ChartData> = new Map();
    const statusCodeToVolumeMap: Map<string, number> = new Map();
    // for each stat, add it in _chartDataMap
    for (const stat of props.data) {
      const chartData = _chartDataMap.get(stat.date);
      const { httpStatusCode } = stat;

      // if no data for current day - create new entry
      if (!chartData && stat.totalRequests > 0) {
        _chartDataMap.set(stat.date, {
          time: stat.date,
          [httpStatusCode || defaultLabel]: stat.totalRequests,
        } as ChartData);
      } else if (chartData) {
        chartData[httpStatusCode || defaultLabel] =
          (chartData[httpStatusCode || defaultLabel] || 0) + stat.totalRequests;
      }

      statusCodeToVolumeMap.set(
        (httpStatusCode || defaultLabel).toString(),
        stat.totalRequests +
          (statusCodeToVolumeMap.get(
            (httpStatusCode || defaultLabel).toString(),
          ) || 0),
      );
    }

    const statusCodesSorted = Array.from(statusCodeToVolumeMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map((w) => w[0]);

    const statusCodesToShow = statusCodesSorted.slice(0, topStatusCodesToShow);
    const statusCodesAsOther = statusCodesSorted.slice(topStatusCodesToShow);

    // replace chainIdsToTagAsOther chainId with "other"
    for (const data of _chartDataMap.values()) {
      for (const statusCode in data) {
        if (statusCodesAsOther.includes(statusCode)) {
          data.others = (data.others || 0) + (data[statusCode] || 0);
          delete data[statusCode];
        }
      }
    }

    statusCodesToShow.forEach((statusCode, i) => {
      _chartConfig[statusCode] = {
        color: `hsl(var(--chart-${(i % 10) + 1}))`,
        label: statusCodesToShow[i],
      };
    });

    if (statusCodesAsOther.length > 0) {
      _chartConfig.others = {
        color: "hsl(var(--muted-foreground))",
        label: "Others",
      };
    }

    return {
      chartConfig: _chartConfig,
      chartData: Array.from(_chartDataMap.values()).sort(
        (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
      ),
    };
  }, [props.data]);

  return (
    <ThirdwebBarChart
      chartClassName="aspect-[1.5] lg:aspect-[3.5]"
      config={chartConfig}
      customHeader={
        <div className="relative px-6 pt-6">
          <h3 className="mb-0.5 font-semibold text-xl tracking-tight">
            {props.title}
          </h3>
          <p className="mb-3 text-muted-foreground text-sm">
            {props.description}
          </p>
        </div>
      }
      data={chartData}
      emptyChartState={<EmptyChartState type="bar" />}
      hideLabel={false}
      isPending={props.isPending}
      showLegend
      toolTipLabelFormatter={(_v, item) => {
        if (Array.isArray(item)) {
          const time = item[0].payload.time as number;
          return format(new Date(time), "MMM d, yyyy");
        }
        return undefined;
      }}
      toolTipValueFormatter={(v) => shortenLargeNumber(v as number)}
      variant="stacked"
    />
  );
}
