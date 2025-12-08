"use client";

import { useState } from "react";
import type {
  InAppWalletStats,
  UniversalBridgeStats,
  X402SettlementsOverall,
} from "@/types/analytics";
import {
  CombinedBarChartCard,
  type CombinedBarChartConfig,
} from "../../../../components/Analytics/CombinedBarChartCard";

type AggregatedMetrics = {
  activeUsers: number;
  newUsers: number;
  feesCollected: number;
  bridgeRevenue: number;
  x402Revenue: number;
};

export function ProjectHighlightsCard(props: {
  aggregatedUserStats: InAppWalletStats[];
  userStats: InAppWalletStats[];
  volumeStats: UniversalBridgeStats[];
  x402Settlements: X402SettlementsOverall[];
}) {
  const { aggregatedUserStats, userStats, volumeStats, x402Settlements } =
    props;

  const [selectedChart, setSelectedChart] = useState<string | undefined>(
    "activeUsers",
  );

  const timeSeriesData = processTimeSeriesData(
    userStats,
    volumeStats,
    x402Settlements,
  );

  const chartConfig: CombinedBarChartConfig<keyof AggregatedMetrics> = {
    activeUsers: { color: "hsl(var(--chart-1))", label: "Active Users" },
    newUsers: { color: "hsl(var(--chart-2))", label: "New Users" },
    bridgeRevenue: {
      color: "hsl(var(--chart-3))",
      isCurrency: true,
      label: "Bridge",
      hideAsTab: true,
    },
    x402Revenue: {
      color: "hsl(var(--chart-4))",
      isCurrency: true,
      label: "x402",
      hideAsTab: true,
    },
    feesCollected: {
      color: "hsl(var(--chart-3))",
      emptyContent: undefined,
      isCurrency: true,
      label: "Revenue",
      stackedKeys: ["bridgeRevenue", "x402Revenue"],
    },
  };

  return (
    <CombinedBarChartCard
      title="Project Highlights"
      activeChart={
        selectedChart && selectedChart in chartConfig
          ? (selectedChart as keyof AggregatedMetrics)
          : "activeUsers"
      }
      aggregateFn={(_data, key) => {
        if (key === "activeUsers") {
          return aggregatedUserStats.reduce(
            (acc, curr) => acc + curr.uniqueWalletsConnected,
            0,
          );
        }
        return timeSeriesData.reduce((acc, curr) => acc + curr[key], 0);
      }}
      chartConfig={chartConfig}
      data={timeSeriesData}
      onSelect={(key) => {
        setSelectedChart(key);
      }}
      trendFn={(data, key) =>
        data.filter((d) => (d[key] as number) > 0).length >= 2
          ? ((data[data.length - 2]?.[key] as number) ?? 0) /
              ((data[0]?.[key] as number) ?? 0) -
            1
          : undefined
      }
    />
  );
}

type TimeSeriesMetrics = AggregatedMetrics & {
  date: string;
  bridgeRevenue: number;
  x402Revenue: number;
};

/**
 * Processes time series data to combine wallet and user statistics
 */
function processTimeSeriesData(
  userStats: InAppWalletStats[],
  volumeStats: UniversalBridgeStats[],
  x402Settlements: X402SettlementsOverall[],
): TimeSeriesMetrics[] {
  const metrics: TimeSeriesMetrics[] = [];
  const dates = [
    ...new Set([
      ...userStats.map((a) => ignoreTimePeriod(a.date)),
      ...volumeStats.map((a) => ignoreTimePeriod(a.date)),
      ...x402Settlements.map((a) => ignoreTimePeriod(a.date)),
    ]),
  ];

  for (const date of dates) {
    const activeUsers = userStats
      .filter((u) => ignoreTimePeriod(u.date) === ignoreTimePeriod(date))
      .reduce((acc, curr) => acc + curr.uniqueWalletsConnected, 0);

    const newUsers = userStats
      .filter((u) => ignoreTimePeriod(u.date) === ignoreTimePeriod(date))
      .reduce((acc, curr) => acc + curr.newUsers, 0);

    const bridgeRevenue = volumeStats
      .filter(
        (v) =>
          ignoreTimePeriod(v.date) === ignoreTimePeriod(date) &&
          v.status === "completed",
      )
      .reduce((acc, curr) => acc + curr.developerFeeUsdCents / 100, 0);

    const x402Revenue = x402Settlements
      .filter((x) => ignoreTimePeriod(x.date) === ignoreTimePeriod(date))
      .reduce((acc, curr) => acc + curr.totalValueUSD, 0);

    metrics.push({
      activeUsers: activeUsers,
      date: date,
      feesCollected: bridgeRevenue + x402Revenue,
      bridgeRevenue: bridgeRevenue,
      x402Revenue: x402Revenue,
      newUsers: newUsers,
    });
  }

  return metrics;
}

function ignoreTimePeriod(date: string) {
  return new Date(date).toISOString().slice(0, 10);
}
