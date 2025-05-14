import {
  getClientTransactions,
  getInAppWalletUsage,
  getUniversalBridgeUsage,
  getUserOpUsage,
  getWalletConnections,
  getWalletUsers,
} from "@/api/analytics";
import {
  type DurationId,
  type Range,
  getLastNDaysRange,
} from "components/analytics/date-range-selector";
import { redirect } from "next/navigation";
import { type WalletId, getWalletInfo } from "thirdweb/wallets";
import type {
  InAppWalletStats,
  UniversalBridgeStats,
  WalletStats,
  WalletUserStats,
} from "types/analytics";
import { AnalyticsHeader } from "../../../../components/Analytics/AnalyticsHeader";
import { CombinedBarChartCard } from "../../../../components/Analytics/CombinedBarChartCard";
import { EmptyState } from "../../../../components/Analytics/EmptyState";
import { PieChartCard } from "../../../../components/Analytics/PieChartCard";

import { getTeamBySlug } from "@/api/team";
import { GenericLoadingPage } from "@/components/blocks/skeletons/GenericLoadingPage";
import {
  EmptyStateCard,
  EmptyStateContent,
} from "app/(app)/team/components/Analytics/EmptyStateCard";
import { Suspense } from "react";
import { TotalSponsoredChartCardUI } from "../../_components/TotalSponsoredCard";
import { TransactionsChartCardUI } from "../../_components/TransactionsCard";

type SearchParams = {
  usersChart?: string;
  from?: string;
  to?: string;
  type?: string;
  interval?: string;
};

export default async function TeamOverviewPage(props: {
  params: Promise<{ team_slug: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const [params, searchParams] = await Promise.all([
    props.params,
    props.searchParams,
  ]);

  const team = await getTeamBySlug(params.team_slug);

  if (!team) {
    redirect("/team");
  }

  const interval = (searchParams.interval as "day" | "week") ?? "week";
  const rangeType = (searchParams.type as DurationId) || "last-120";
  const range: Range = {
    from: new Date(searchParams.from ?? getLastNDaysRange("last-120").from),
    to: new Date(searchParams.to ?? getLastNDaysRange("last-120").to),
    type: rangeType,
  };

  return (
    <div className="flex grow flex-col">
      <div className="border-b">
        <AnalyticsHeader
          title="Analytics"
          interval={interval}
          range={range}
          showRangeSelector={true}
        />
      </div>
      <div className="flex grow flex-col justify-between gap-10 md:container md:pt-8 md:pb-16">
        <Suspense fallback={<GenericLoadingPage />}>
          <OverviewPageContent
            teamId={team.id}
            range={range}
            interval={interval}
            searchParams={searchParams}
          />
        </Suspense>
      </div>
    </div>
  );
}

async function OverviewPageContent(props: {
  teamId: string;
  range: Range;
  interval: "day" | "week";
  searchParams: SearchParams;
}) {
  const { teamId, range, interval, searchParams } = props;

  const [
    walletConnections,
    walletUserStatsTimeSeries,
    inAppWalletUsage,
    userOpUsageTimeSeries,
    userOpUsage,
    clientTransactionsTimeSeries,
    clientTransactions,
    universalBridgeUsage,
  ] = await Promise.all([
    // Aggregated wallet connections
    getWalletConnections({
      teamId: teamId,
      from: range.from,
      to: range.to,
      period: "all",
    }),
    // Time series data for wallet users
    getWalletUsers({
      teamId: teamId,
      from: range.from,
      to: range.to,
      period: interval,
    }),
    // In-app wallet usage
    getInAppWalletUsage({
      teamId: teamId,
      from: range.from,
      to: range.to,
      period: "all",
    }),
    // User operations usage
    getUserOpUsage({
      teamId,
      from: range.from,
      to: range.to,
      period: interval,
    }),
    getUserOpUsage({
      teamId,
      from: range.from,
      to: range.to,
      period: "all",
    }),
    // Client transactions
    getClientTransactions({
      teamId: teamId,
      from: range.from,
      to: range.to,
      period: interval,
    }),
    getClientTransactions({
      teamId: teamId,
      from: range.from,
      to: range.to,
      period: "all",
    }),
    // Universal Bridge
    getUniversalBridgeUsage({
      teamId: teamId,
      from: range.from,
      to: range.to,
      period: interval,
    }),
  ]);

  const isEmpty =
    !walletUserStatsTimeSeries.some((w) => w.totalUsers !== 0) &&
    walletConnections.length === 0 &&
    inAppWalletUsage.length === 0 &&
    userOpUsage.length === 0;

  if (isEmpty) {
    return <EmptyState />;
  }

  return (
    <div className="flex grow flex-col gap-6">
      {walletUserStatsTimeSeries.some((w) => w.totalUsers !== 0) ? (
        <div className="">
          <AppHighlightsCard
            userStats={walletUserStatsTimeSeries}
            volumeStats={universalBridgeUsage}
            searchParams={searchParams}
          />
        </div>
      ) : (
        <EmptyStateCard
          metric="Connect"
          link="https://portal.thirdweb.com/connect/quickstart"
        />
      )}
      <div className="grid gap-6 max-md:px-6 md:grid-cols-2">
        {walletConnections.length > 0 ? (
          <WalletDistributionCard data={walletConnections} />
        ) : (
          <EmptyStateCard
            metric="Connect"
            link="https://portal.thirdweb.com/connect/quickstart"
          />
        )}
        {inAppWalletUsage.length > 0 ? (
          <AuthMethodDistributionCard data={inAppWalletUsage} />
        ) : (
          <EmptyStateCard
            metric="In-App Wallets"
            link="https://portal.thirdweb.com/typescript/v5/inAppWallet"
          />
        )}
      </div>
      {clientTransactions.length > 0 && (
        <TransactionsChartCardUI
          searchParams={searchParams}
          data={clientTransactionsTimeSeries}
          aggregatedData={clientTransactions}
          className="max-md:rounded-none max-md:border-r-0 max-md:border-l-0"
        />
      )}
      {userOpUsage.length > 0 ? (
        <TotalSponsoredChartCardUI
          searchParams={searchParams}
          data={userOpUsageTimeSeries}
          aggregatedData={userOpUsage}
          className="max-md:rounded-none max-md:border-r-0 max-md:border-l-0"
        />
      ) : (
        <EmptyStateCard
          metric="Gas Sponsored"
          link="https://portal.thirdweb.com/typescript/v5/account-abstraction/get-started"
        />
      )}
    </div>
  );
}

type AggregatedMetrics = {
  activeUsers: number;
  newUsers: number;
  totalVolume: number;
  feesCollected: number;
};

type TimeSeriesMetrics = AggregatedMetrics & {
  date: string;
};

function processTimeSeriesData(
  userStats: WalletUserStats[],
  volumeStats: UniversalBridgeStats[],
): TimeSeriesMetrics[] {
  const metrics: TimeSeriesMetrics[] = [];

  for (const stat of userStats) {
    const volume = volumeStats
      .filter((v) => v.date === stat.date && v.status === "completed")
      .reduce((acc, curr) => acc + curr.amountUsdCents / 100, 0);

    const fees = volumeStats
      .filter((v) => v.date === stat.date && v.status === "completed")
      .reduce((acc, curr) => acc + curr.developerFeeUsdCents / 100, 0);

    metrics.push({
      date: stat.date,
      activeUsers: stat.totalUsers ?? 0,
      newUsers: stat.newUsers ?? 0,
      totalVolume: volume,
      feesCollected: fees,
    });
  }

  return metrics;
}

function AppHighlightsCard({
  userStats,
  volumeStats,
  searchParams,
}: {
  userStats: WalletUserStats[];
  volumeStats: UniversalBridgeStats[];
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const timeSeriesData = processTimeSeriesData(userStats, volumeStats);

  const chartConfig = {
    totalVolume: {
      label: "Total Volume",
      color: "hsl(var(--chart-2))",
      isCurrency: true,
      emptyContent: (
        <EmptyStateContent
          metric="Payments"
          description="Onramp, swap, and bridge with thirdweb's Universal Bridge."
          link="https://portal.thirdweb.com/connect/pay/overview"
        />
      ),
    },
    feesCollected: {
      label: "Fee Revenue",
      color: "hsl(var(--chart-4))",
      isCurrency: true,
      emptyContent: (
        <EmptyStateContent
          metric="Fees"
          description="Your apps haven't collected any fees yet."
          link={"https://portal.thirdweb.com/connect/pay/fees"}
        />
      ),
    },
    activeUsers: { label: "Active Users", color: "hsl(var(--chart-1))" },
    newUsers: { label: "New Users", color: "hsl(var(--chart-3))" },
  } as const;

  return (
    <CombinedBarChartCard
      className="max-md:rounded-none max-md:border-r-0 max-md:border-l-0"
      title="App Highlights"
      chartConfig={chartConfig}
      activeChart={
        (searchParams?.appHighlights as keyof AggregatedMetrics) ??
        "totalVolume"
      }
      data={timeSeriesData}
      aggregateFn={(_data, key) =>
        timeSeriesData.reduce((acc, curr) => acc + curr[key], 0)
      }
      // Get the trend from the last two COMPLETE periods
      trendFn={(data, key) =>
        data.filter((d) => (d[key] as number) > 0).length >= 3
          ? ((data[data.length - 2]?.[key] as number) ?? 0) /
              ((data[data.length - 3]?.[key] as number) ?? 0) -
            1
          : undefined
      }
      queryKey="appHighlights"
      existingQueryParams={searchParams}
    />
  );
}

async function WalletDistributionCard({ data }: { data: WalletStats[] }) {
  const formattedData = await Promise.all(
    data
      .filter((w) => w.walletType !== "smart" && w.walletType !== "smartWallet")
      .map(async (w) => {
        const wallet = await getWalletInfo(w.walletType as WalletId).catch(
          () => ({ name: w.walletType }),
        );
        return {
          walletType: w.walletType,
          uniqueWalletsConnected: w.uniqueWalletsConnected,
          totalConnections: w.totalConnections,
          walletName: wallet.name,
        };
      }),
  );

  return (
    <PieChartCard
      title="Wallets Connected"
      data={formattedData.map(({ walletName, uniqueWalletsConnected }) => {
        return {
          value: uniqueWalletsConnected,
          label: walletName,
        };
      })}
    />
  );
}

function AuthMethodDistributionCard({ data }: { data: InAppWalletStats[] }) {
  return (
    <PieChartCard
      title="Social Authentication"
      data={data.map(({ authenticationMethod, uniqueWalletsConnected }) => ({
        value: uniqueWalletsConnected,
        label: authenticationMethod,
      }))}
    />
  );
}
