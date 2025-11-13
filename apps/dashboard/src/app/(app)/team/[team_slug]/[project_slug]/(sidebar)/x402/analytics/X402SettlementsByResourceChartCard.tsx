"use client";
import { format } from "date-fns";
import { type ReactNode, useMemo } from "react";
import { ThirdwebBarChart } from "@/components/blocks/charts/bar-chart";
import type { ChartConfig } from "@/components/ui/chart";
import type { X402SettlementsByResource } from "@/types/analytics";
import { toUSD } from "@/utils/number";

type ChartData = Record<string, number> & {
  time: string;
};

export function X402SettlementsByResourceChartCard({
  rawData,
  isPending,
  metric = "payments",
}: {
  rawData: X402SettlementsByResource[];
  isPending: boolean;
  metric?: "payments" | "volume";
}) {
  const maxResourcesToDisplay = 10;
  const isVolumeMetric = metric === "volume";

  const { data, chartConfig } = useMemo(() => {
    const dateToValueMap: Map<string, ChartData> = new Map();
    const resourceToCountMap: Map<string, number> = new Map();

    for (const dataItem of rawData) {
      const { date, resource, totalRequests, totalValueUSD } = dataItem;
      const value = isVolumeMetric ? totalValueUSD : totalRequests;
      let dateRecord = dateToValueMap.get(date);

      if (!dateRecord) {
        dateRecord = { time: date } as ChartData;
        dateToValueMap.set(date, dateRecord);
      }

      dateRecord[resource] = (dateRecord[resource] || 0) + value;
      resourceToCountMap.set(
        resource,
        (resourceToCountMap.get(resource) || 0) + value,
      );
    }

    // Sort resources by count (highest count first) - remove the ones with 0 count
    const sortedResourcesByCount = Array.from(resourceToCountMap.entries())
      .sort((a, b) => b[1] - a[1])
      .filter((x) => x[1] > 0);

    const resourcesToDisplayArray = sortedResourcesByCount
      .slice(0, maxResourcesToDisplay)
      .map(([resource]) => resource);
    const resourcesToDisplay = new Set(resourcesToDisplayArray);

    // Loop over each entry in dateToValueMap
    // Replace the resource that is not in resourcesToDisplay with "Other"
    // Add total key that is the sum of all resources
    for (const dateRecord of dateToValueMap.values()) {
      // Calculate total
      let totalCountOfDay = 0;
      for (const key of Object.keys(dateRecord)) {
        if (key !== "time") {
          totalCountOfDay += (dateRecord[key] as number) || 0;
        }
      }

      const keysToMove = Object.keys(dateRecord).filter(
        (key) => key !== "time" && !resourcesToDisplay.has(key),
      );

      for (const resource of keysToMove) {
        dateRecord.Other =
          (dateRecord.Other || 0) + (dateRecord[resource] || 0);
        delete dateRecord[resource];
      }

      dateRecord.total = totalCountOfDay;
    }

    const returnValue: ChartData[] = Array.from(dateToValueMap.values()).sort(
      (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
    );

    const chartConfig: ChartConfig = {};
    for (let i = 0; i < resourcesToDisplayArray.length; i++) {
      const resource = resourcesToDisplayArray[i];
      if (resource) {
        chartConfig[resource] = {
          label: resource,
          color: `hsl(var(--chart-${(i % 10) + 1}))`,
          isCurrency: isVolumeMetric,
        };
      }
    }

    // If we need to display "Other" resources
    if (sortedResourcesByCount.length > maxResourcesToDisplay) {
      chartConfig.Other = {
        label: "Other",
        color: "hsl(var(--muted-foreground))",
        isCurrency: isVolumeMetric,
      };
      resourcesToDisplayArray.push("Other");
    }

    return {
      chartConfig,
      data: returnValue,
      isAllEmpty: returnValue.every((d) => (d.total || 0) === 0),
      resourcesToDisplay: resourcesToDisplayArray,
    };
  }, [rawData, isVolumeMetric]);

  const emptyChartState = (
    <div className="flex h-[250px] items-center justify-center">
      <p className="text-muted-foreground text-sm">No data available</p>
    </div>
  );

  const title = isVolumeMetric ? "Volume by Resource" : "Payments by Resource";

  return (
    <ThirdwebBarChart
      chartClassName="aspect-auto h-[250px]"
      config={chartConfig}
      customHeader={
        <div className="px-6 pt-6">
          <h3 className="mb-0.5 font-semibold text-xl tracking-tight">
            {title}
          </h3>
        </div>
      }
      data={data}
      emptyChartState={emptyChartState}
      hideLabel={false}
      isPending={isPending}
      showLegend
      toolTipValueFormatter={(value: unknown) => {
        if (isVolumeMetric) {
          return `${toUSD(Number(value))}`;
        }
        return value as ReactNode;
      }}
      toolTipLabelFormatter={(_v, item) => {
        if (Array.isArray(item)) {
          const time = item[0].payload.time as string;
          return format(new Date(time), "MMM d, yyyy");
        }
        return undefined;
      }}
      variant="stacked"
    />
  );
}
