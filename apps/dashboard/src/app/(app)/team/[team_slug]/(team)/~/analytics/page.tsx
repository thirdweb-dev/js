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
import { PieChartCard } from "../../../../components/Analytics/PieChartCard";

import { getTeamBySlug } from "@/api/team";
import {
  EmptyStateCard,
  EmptyStateContent,
} from "app/(app)/team/components/Analytics/EmptyStateCard";
import { LoadingChartState } from "components/analytics/empty-chart-state";
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
        <div className="flex grow flex-col gap-6">
          <Suspense
            fallback={<LoadingChartState className="h-[458px] border" />}
          >
            <AsyncAppHighlightsCard
              teamId={team.id}
              range={range}
              interval={interval}
              searchParams={searchParams}
            />
          </Suspense>

          <div className="grid gap-6 max-md:px-6 md:grid-cols-2">
            <Suspense
              fallback={<LoadingChartState className="h-[431px] border" />}
            >
              <AsyncWalletDistributionCard teamId={team.id} range={range} />
            </Suspense>

            <Suspense
              fallback={<LoadingChartState className="h-[431px] border" />}
            >
              <AsyncAuthMethodDistributionCard teamId={team.id} range={range} />
            </Suspense>
          </div>

          <Suspense
            fallback={<LoadingChartState className="h-[458px] border" />}
          >
            <AsyncTransactionsChartCard
              teamId={team.id}
              range={range}
              interval={interval}
              searchParams={searchParams}
            />
          </Suspense>

          <Suspense
            fallback={<LoadingChartState className="h-[458px] border" />}
          >
            <AsyncTotalSponsoredCard
              teamId={team.id}
              range={range}
              interval={interval}
              searchParams={searchParams}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

async function AsyncAppHighlightsCard(props: {
  teamId: string;
  range: Range;
  interval: "day" | "week";
  searchParams: SearchParams;
}) {
  const [walletUserStatsTimeSeries, universalBridgeUsage] =
    await Promise.allSettled([
      getWalletUsers({
        teamId: props.teamId,
        from: props.range.from,
        to: props.range.to,
        period: props.interval,
      }),
      getUniversalBridgeUsage({
        teamId: props.teamId,
        from: props.range.from,
        to: props.range.to,
        period: props.interval,
      }),
    ]);

  if (
    walletUserStatsTimeSeries.status === "fulfilled" &&
    universalBridgeUsage.status === "fulfilled" &&
    walletUserStatsTimeSeries.value.some((w) => w.totalUsers !== 0)
  ) {
    return (
      <div className="">
        <AppHighlightsCard
          userStats={walletUserStatsTimeSeries.value}
          volumeStats={universalBridgeUsage.value}
          searchParams={props.searchParams}
        />
      </div>
    );
  }

  return (
    <EmptyStateCard
      metric="Connect"
      link="https://portal.thirdweb.com/connect/quickstart"
    />
  );
}

async function AsyncWalletDistributionCard(props: {
  teamId: string;
  range: Range;
}) {
  const walletConnections = await getWalletConnections({
    teamId: props.teamId,
    from: props.range.from,
    to: props.range.to,
    period: "all",
  }).catch(() => undefined);

  return walletConnections && walletConnections.length > 0 ? (
    <WalletDistributionCard data={walletConnections} />
  ) : (
    <EmptyStateCard
      metric="Connect"
      link="https://portal.thirdweb.com/connect/quickstart"
    />
  );
}

async function AsyncAuthMethodDistributionCard(props: {
  teamId: string;
  range: Range;
}) {
  const inAppWalletUsage = await getInAppWalletUsage({
    teamId: props.teamId,
    from: props.range.from,
    to: props.range.to,
    period: "all",
  }).catch(() => undefined);

  return inAppWalletUsage && inAppWalletUsage.length > 0 ? (
    <AuthMethodDistributionCard data={inAppWalletUsage} />
  ) : (
    <EmptyStateCard
      metric="In-App Wallets"
      link="https://portal.thirdweb.com/typescript/v5/inAppWallet"
    />
  );
}

async function AsyncTransactionsChartCard(props: {
  teamId: string;
  range: Range;
  interval: "day" | "week";
  searchParams: SearchParams;
}) {
  const [clientTransactionsTimeSeries, clientTransactions] =
    await Promise.allSettled([
      getClientTransactions({
        teamId: props.teamId,
        from: props.range.from,
        to: props.range.to,
        period: props.interval,
      }),
      getClientTransactions({
        teamId: props.teamId,
        from: props.range.from,
        to: props.range.to,
        period: "all",
      }),
    ]);

  return clientTransactionsTimeSeries.status === "fulfilled" &&
    clientTransactions.status === "fulfilled" &&
    clientTransactions.value.length > 0 ? (
    <TransactionsChartCardUI
      searchParams={props.searchParams}
      data={clientTransactionsTimeSeries.value}
      aggregatedData={clientTransactions.value}
      className="max-md:rounded-none max-md:border-r-0 max-md:border-l-0"
    />
  ) : (
    <EmptyStateCard
      metric="Transactions"
      link="https://portal.thirdweb.com/connect/quickstart"
    />
  );
}

async function AsyncTotalSponsoredCard(props: {
  teamId: string;
  range: Range;
  interval: "day" | "week";
  searchParams: SearchParams;
}) {
  const [userOpUsageTimeSeries, userOpUsage] = await Promise.allSettled([
    getUserOpUsage({
      teamId: props.teamId,
      from: props.range.from,
      to: props.range.to,
      period: props.interval,
    }),
    getUserOpUsage({
      teamId: props.teamId,
      from: props.range.from,
      to: props.range.to,
      period: "all",
    }),
  ]);

  return userOpUsageTimeSeries.status === "fulfilled" &&
    userOpUsage.status === "fulfilled" &&
    userOpUsage.value.length > 0 ? (
    <TotalSponsoredChartCardUI
      searchParams={props.searchParams}
      data={userOpUsageTimeSeries.value}
      aggregatedData={userOpUsage.value}
      className="max-md:rounded-none max-md:border-r-0 max-md:border-l-0"
    />
  ) : (
    <EmptyStateCard
      metric="Gas Sponsored"
      link="https://portal.thirdweb.com/typescript/v5/account-abstraction/get-started"
    />
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
      .filter(
        (v) =>
          new Date(v.date).toISOString() ===
            new Date(stat.date).toISOString() && v.status === "completed",
      )
      .reduce((acc, curr) => acc + curr.amountUsdCents / 100, 0);

    const fees = volumeStats
      .filter(
        (v) =>
          new Date(v.date).toISOString() ===
            new Date(stat.date).toISOString() && v.status === "completed",
      )
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
      aggregateFn={(_data, key) => {
        if (key === "activeUsers") {
          return Math.max(...timeSeriesData.map((d) => d[key]));
        }
        return timeSeriesData.reduce((acc, curr) => acc + curr[key], 0);
      }}
      trendFn={(data, key) =>
        data.filter((d) => (d[key] as number) > 0).length >= 2
          ? ((data[data.length - 2]?.[key] as number) ?? 0) /
              ((data[0]?.[key] as number) ?? 0) -
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
