"use client";
import { format } from "date-fns";
import { type ReactNode, useMemo } from "react";
import { ThirdwebBarChart } from "@/components/blocks/charts/bar-chart";
import type { ChartConfig } from "@/components/ui/chart";
import { useAllChainsData } from "@/hooks/chains/allChains";
import type { X402SettlementsByChainId } from "@/types/analytics";
import { toUSD } from "@/utils/number";

type ChartData = Record<string, number> & {
  time: string;
};

export function X402SettlementsByChainChartCard({
  rawData,
  isPending,
  metric = "payments",
}: {
  rawData: X402SettlementsByChainId[];
  isPending: boolean;
  metric?: "payments" | "volume";
}) {
  const maxChainsToDisplay = 10;
  const isVolumeMetric = metric === "volume";
  const chainsStore = useAllChainsData();

  const { data, chainsToDisplay, chartConfig, isAllEmpty } = useMemo(() => {
    const dateToValueMap: Map<string, ChartData> = new Map();
    const chainToCountMap: Map<string, number> = new Map();

    for (const dataItem of rawData) {
      const { date, chainId, totalRequests, totalValueUSD } = dataItem;
      const value = isVolumeMetric ? totalValueUSD : totalRequests;
      let dateRecord = dateToValueMap.get(date);

      if (!dateRecord) {
        dateRecord = { time: date } as ChartData;
        dateToValueMap.set(date, dateRecord);
      }

      // Convert chainId to chain name
      const chain = chainsStore.idToChain.get(Number(chainId));
      const chainName = chain?.name || chainId.toString();

      dateRecord[chainName] = (dateRecord[chainName] || 0) + value;
      chainToCountMap.set(
        chainName,
        (chainToCountMap.get(chainName) || 0) + value,
      );
    }

    // Sort chains by count (highest count first) - remove the ones with 0 count
    const sortedChainsByCount = Array.from(chainToCountMap.entries())
      .sort((a, b) => b[1] - a[1])
      .filter((x) => x[1] > 0);

    const chainsToDisplayArray = sortedChainsByCount
      .slice(0, maxChainsToDisplay)
      .map(([chain]) => chain);
    const chainsToDisplaySet = new Set(chainsToDisplayArray);

    // Loop over each entry in dateToValueMap
    // Replace the chain that is not in chainsToDisplay with "Other"
    // Add total key that is the sum of all chains
    for (const dateRecord of dateToValueMap.values()) {
      // Calculate total
      let totalCountOfDay = 0;
      for (const key of Object.keys(dateRecord)) {
        if (key !== "time") {
          totalCountOfDay += (dateRecord[key] as number) || 0;
        }
      }

      const keysToMove = Object.keys(dateRecord).filter(
        (key) => key !== "time" && !chainsToDisplaySet.has(key),
      );

      for (const chain of keysToMove) {
        dateRecord.Other = (dateRecord.Other || 0) + (dateRecord[chain] || 0);
        delete dateRecord[chain];
      }

      dateRecord.total = totalCountOfDay;
    }

    const returnValue: ChartData[] = Array.from(dateToValueMap.values()).sort(
      (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
    );

    const chartConfig: ChartConfig = {};
    for (let i = 0; i < chainsToDisplayArray.length; i++) {
      const chain = chainsToDisplayArray[i];
      if (chain) {
        chartConfig[chain] = {
          label: chain,
          color: `hsl(var(--chart-${(i % 10) + 1}))`,
          isCurrency: isVolumeMetric,
        };
      }
    }

    // If we need to display "Other" chains
    if (sortedChainsByCount.length > maxChainsToDisplay) {
      chartConfig.Other = {
        label: "Other",
        color: "hsl(var(--muted-foreground))",
        isCurrency: isVolumeMetric,
      };
      chainsToDisplayArray.push("Other");
    }

    return {
      chartConfig,
      data: returnValue,
      isAllEmpty: returnValue.every((d) => (d.total || 0) === 0),
      chainsToDisplay: chainsToDisplayArray,
    };
  }, [rawData, isVolumeMetric, chainsStore]);

  const emptyChartState = (
    <div className="flex h-[250px] items-center justify-center">
      <p className="text-muted-foreground text-sm">No data available</p>
    </div>
  );

  const title = isVolumeMetric ? "Volume by Chain" : "Payments by Chain";

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
