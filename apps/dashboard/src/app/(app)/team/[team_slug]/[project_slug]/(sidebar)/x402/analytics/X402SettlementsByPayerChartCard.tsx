"use client";
import { format } from "date-fns";
import { type ReactNode, useMemo } from "react";
import { ThirdwebBarChart } from "@/components/blocks/charts/bar-chart";
import type { ChartConfig } from "@/components/ui/chart";
import type { X402SettlementsByPayer } from "@/types/analytics";
import { toUSD } from "@/utils/number";

type ChartData = Record<string, number> & {
  time: string;
};

export function X402SettlementsByPayerChartCard({
  rawData,
  isPending,
  metric = "payments",
}: {
  rawData: X402SettlementsByPayer[];
  isPending: boolean;
  metric?: "payments" | "volume";
}) {
  const maxPayersToDisplay = 10;
  const isVolumeMetric = metric === "volume";

  const { data, chartConfig } = useMemo(() => {
    const dateToValueMap: Map<string, ChartData> = new Map();
    const payerToCountMap: Map<string, number> = new Map();

    for (const dataItem of rawData) {
      const { date, payer, totalRequests, totalValueUSD } = dataItem;
      const value = isVolumeMetric ? totalValueUSD : totalRequests;
      let dateRecord = dateToValueMap.get(date);

      if (!dateRecord) {
        dateRecord = { time: date } as ChartData;
        dateToValueMap.set(date, dateRecord);
      }

      // Truncate payer address for display
      const displayPayer =
        payer.length > 10 ? `${payer.slice(0, 6)}...${payer.slice(-4)}` : payer;

      dateRecord[displayPayer] = (dateRecord[displayPayer] || 0) + value;
      payerToCountMap.set(
        displayPayer,
        (payerToCountMap.get(displayPayer) || 0) + value,
      );
    }

    // Sort payers by count (highest count first) - remove the ones with 0 count
    const sortedPayersByCount = Array.from(payerToCountMap.entries())
      .sort((a, b) => b[1] - a[1])
      .filter((x) => x[1] > 0);

    const payersToDisplayArray = sortedPayersByCount
      .slice(0, maxPayersToDisplay)
      .map(([payer]) => payer);
    const payersToDisplay = new Set(payersToDisplayArray);

    // Loop over each entry in dateToValueMap
    // Replace the payer that is not in payersToDisplay with "Other"
    // Add total key that is the sum of all payers
    for (const dateRecord of dateToValueMap.values()) {
      // Calculate total
      let totalCountOfDay = 0;
      for (const key of Object.keys(dateRecord)) {
        if (key !== "time") {
          totalCountOfDay += (dateRecord[key] as number) || 0;
        }
      }

      const keysToMove = Object.keys(dateRecord).filter(
        (key) => key !== "time" && !payersToDisplay.has(key),
      );

      for (const payer of keysToMove) {
        dateRecord.Other = (dateRecord.Other || 0) + (dateRecord[payer] || 0);
        delete dateRecord[payer];
      }

      dateRecord.total = totalCountOfDay;
    }

    const returnValue: ChartData[] = Array.from(dateToValueMap.values()).sort(
      (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
    );

    const chartConfig: ChartConfig = {};
    for (let i = 0; i < payersToDisplayArray.length; i++) {
      const payer = payersToDisplayArray[i];
      if (payer) {
        chartConfig[payer] = {
          label: payer,
          color: `hsl(var(--chart-${(i % 10) + 1}))`,
          isCurrency: isVolumeMetric,
        };
      }
    }

    // If we need to display "Other" payers
    if (sortedPayersByCount.length > maxPayersToDisplay) {
      chartConfig.Other = {
        label: "Other",
        color: "hsl(var(--muted-foreground))",
        isCurrency: isVolumeMetric,
      };
      payersToDisplayArray.push("Other");
    }

    return {
      chartConfig,
      data: returnValue,
      isAllEmpty: returnValue.every((d) => (d.total || 0) === 0),
      payersToDisplay: payersToDisplayArray,
    };
  }, [rawData, isVolumeMetric]);

  const emptyChartState = (
    <div className="flex h-[250px] items-center justify-center">
      <p className="text-muted-foreground text-sm">No data available</p>
    </div>
  );

  const title = isVolumeMetric ? "Volume by Buyer" : "Payments by Buyer";

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
