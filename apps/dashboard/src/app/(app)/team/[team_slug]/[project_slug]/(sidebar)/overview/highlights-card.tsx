"use client";

import { EmptyStateContent } from "app/(app)/team/components/Analytics/EmptyStateCard";
import { useSetResponsiveSearchParams } from "responsive-rsc";
import type { InAppWalletStats, UniversalBridgeStats } from "@/types/analytics";
import { CombinedBarChartCard } from "../../../../components/Analytics/CombinedBarChartCard";

type AggregatedMetrics = {
  activeUsers: number;
  newUsers: number;
  totalVolume: number;
  feesCollected: number;
};

export function ProjectHighlightsCard(props: {
  selectedChart: string | undefined;
  userStats: InAppWalletStats[];
  volumeStats: UniversalBridgeStats[];
  teamSlug: string;
  projectSlug: string;
  selectedChartQueryParam: string;
}) {
  const {
    selectedChart,
    userStats,
    volumeStats,
    teamSlug,
    projectSlug,
    selectedChartQueryParam,
  } = props;

  const timeSeriesData = processTimeSeriesData(userStats, volumeStats);
  const setResponsiveSearchParams = useSetResponsiveSearchParams();

  const chartConfig = {
    activeUsers: { color: "hsl(var(--chart-1))", label: "Active Users" },
    newUsers: { color: "hsl(var(--chart-3))", label: "New Users" },
    totalVolume: {
      color: "hsl(var(--chart-2))",
      emptyContent: (
        <EmptyStateContent
          description="Onramp, swap, and bridge with thirdweb's Payments."
          link="https://portal.thirdweb.com/payments"
          metric="Payments"
        />
      ),
      isCurrency: true,
      label: "Total Volume",
    },
    feesCollected: {
      color: "hsl(var(--chart-4))",
      emptyContent: (
        <EmptyStateContent
          description="Your app hasn't collected any fees yet."
          link={`/team/${teamSlug}/${projectSlug}/payments/settings`}
          metric="Fees"
        />
      ),
      isCurrency: true,
      label: "Fee Revenue",
    },
  } as const;

  return (
    <CombinedBarChartCard
      title="Project Highlights"
      activeChart={
        selectedChart && selectedChart in chartConfig
          ? (selectedChart as keyof AggregatedMetrics)
          : "activeUsers"
      }
      aggregateFn={(_data, key) => {
        return timeSeriesData.reduce((acc, curr) => acc + curr[key], 0);
      }}
      chartConfig={chartConfig}
      data={timeSeriesData}
      onSelect={(key) => {
        setResponsiveSearchParams((v) => {
          return {
            ...v,
            [selectedChartQueryParam]: key,
          };
        });
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
};

/**
 * Processes time series data to combine wallet and user statistics
 */
function processTimeSeriesData(
  userStats: InAppWalletStats[],
  volumeStats: UniversalBridgeStats[],
): TimeSeriesMetrics[] {
  const metrics: TimeSeriesMetrics[] = [];
  const dates = [...new Set(userStats.map((a) => a.date))];

  for (const date of dates) {
    const activeUsers = userStats
      .filter(
        (u) => new Date(u.date).toISOString() === new Date(date).toISOString(),
      )
      .reduce((acc, curr) => acc + curr.uniqueWalletsConnected, 0);

    const newUsers = userStats
      .filter(
        (u) => new Date(u.date).toISOString() === new Date(date).toISOString(),
      )
      .reduce((acc, curr) => acc + curr.newUsers, 0);

    const volume = volumeStats
      .filter(
        (v) =>
          new Date(v.date).toISOString() === new Date(date).toISOString() &&
          v.status === "completed",
      )
      .reduce((acc, curr) => acc + curr.amountUsdCents / 100, 0);

    const fees = volumeStats
      .filter(
        (v) =>
          new Date(v.date).toISOString() === new Date(date).toISOString() &&
          v.status === "completed",
      )
      .reduce((acc, curr) => acc + curr.developerFeeUsdCents / 100, 0);

    metrics.push({
      activeUsers: activeUsers,
      date: date,
      feesCollected: fees,
      newUsers: newUsers,
      totalVolume: volume,
    });
  }

  return metrics;
}
