import {
  EmptyStateCard,
  EmptyStateContent,
} from "app/(app)/team/components/Analytics/EmptyStateCard";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getWalletInfo, type WalletId } from "thirdweb/wallets";
import {
  getClientTransactions,
  getInAppWalletUsage,
  getUniversalBridgeUsage,
  getUserOpUsage,
  getWalletConnections,
  getWalletUsers,
} from "@/api/analytics";
import { getTeamBySlug } from "@/api/team";
import {
  type DurationId,
  getLastNDaysRange,
  type Range,
} from "@/components/analytics/date-range-selector";
import { LoadingChartState } from "@/components/analytics/empty-chart-state";
import type {
  InAppWalletStats,
  UniversalBridgeStats,
  WalletStats,
  WalletUserStats,
} from "@/types/analytics";
import { AnalyticsHeader } from "../../../../components/Analytics/AnalyticsHeader";
import { CombinedBarChartCard } from "../../../../components/Analytics/CombinedBarChartCard";
import { PieChartCard } from "../../../../components/Analytics/PieChartCard";
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
          interval={interval}
          range={range}
          showRangeSelector={true}
          title="Analytics"
        />
      </div>

      <div className="flex grow flex-col justify-between gap-10 container max-w-7xl pt-8 pb-16">
        <div className="flex grow flex-col gap-6">
          <Suspense
            fallback={<LoadingChartState className="h-[458px] border" />}
          >
            <AsyncAppHighlightsCard
              interval={interval}
              range={range}
              searchParams={searchParams}
              teamId={team.id}
            />
          </Suspense>

          <div className="grid gap-6 md:grid-cols-2">
            <Suspense
              fallback={<LoadingChartState className="h-[431px] border" />}
            >
              <AsyncWalletDistributionCard range={range} teamId={team.id} />
            </Suspense>

            <Suspense
              fallback={<LoadingChartState className="h-[431px] border" />}
            >
              <AsyncAuthMethodDistributionCard range={range} teamId={team.id} />
            </Suspense>
          </div>

          <Suspense
            fallback={<LoadingChartState className="h-[458px] border" />}
          >
            <AsyncTransactionsChartCard
              interval={interval}
              range={range}
              searchParams={searchParams}
              teamId={team.id}
            />
          </Suspense>

          <Suspense
            fallback={<LoadingChartState className="h-[458px] border" />}
          >
            <AsyncTotalSponsoredCard
              interval={interval}
              range={range}
              searchParams={searchParams}
              teamId={team.id}
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
        from: props.range.from,
        period: props.interval,
        teamId: props.teamId,
        to: props.range.to,
      }),
      getUniversalBridgeUsage({
        from: props.range.from,
        period: props.interval,
        teamId: props.teamId,
        to: props.range.to,
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
          searchParams={props.searchParams}
          userStats={walletUserStatsTimeSeries.value}
          volumeStats={universalBridgeUsage.value}
        />
      </div>
    );
  }

  return (
    <EmptyStateCard
      link="https://portal.thirdweb.com/wallets"
      metric="Wallets"
    />
  );
}

async function AsyncWalletDistributionCard(props: {
  teamId: string;
  range: Range;
}) {
  const walletConnections = await getWalletConnections({
    from: props.range.from,
    period: "all",
    teamId: props.teamId,
    to: props.range.to,
  }).catch(() => undefined);

  return walletConnections && walletConnections.length > 0 ? (
    <WalletDistributionCard data={walletConnections} />
  ) : (
    <EmptyStateCard
      link="https://portal.thirdweb.com/wallets"
      metric="Wallets"
    />
  );
}

async function AsyncAuthMethodDistributionCard(props: {
  teamId: string;
  range: Range;
}) {
  const inAppWalletUsage = await getInAppWalletUsage({
    from: props.range.from,
    period: "all",
    teamId: props.teamId,
    to: props.range.to,
  }).catch(() => undefined);

  return inAppWalletUsage && inAppWalletUsage.length > 0 ? (
    <AuthMethodDistributionCard data={inAppWalletUsage} />
  ) : (
    <EmptyStateCard
      link="https://portal.thirdweb.com/typescript/v5/inAppWallet"
      metric="Wallets"
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
        from: props.range.from,
        period: props.interval,
        teamId: props.teamId,
        to: props.range.to,
      }),
      getClientTransactions({
        from: props.range.from,
        period: "all",
        teamId: props.teamId,
        to: props.range.to,
      }),
    ]);

  return clientTransactionsTimeSeries.status === "fulfilled" &&
    clientTransactions.status === "fulfilled" &&
    clientTransactions.value.length > 0 ? (
    <TransactionsChartCardUI
      aggregatedData={clientTransactions.value}
      data={clientTransactionsTimeSeries.value}
      searchParams={props.searchParams}
    />
  ) : (
    <EmptyStateCard
      link="https://portal.thirdweb.com/wallets"
      metric="Wallets"
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
      from: props.range.from,
      period: props.interval,
      teamId: props.teamId,
      to: props.range.to,
    }),
    getUserOpUsage({
      from: props.range.from,
      period: "all",
      teamId: props.teamId,
      to: props.range.to,
    }),
  ]);

  return userOpUsageTimeSeries.status === "fulfilled" &&
    userOpUsage.status === "fulfilled" &&
    userOpUsage.value.length > 0 ? (
    <TotalSponsoredChartCardUI
      aggregatedData={userOpUsage.value}
      data={userOpUsageTimeSeries.value}
      searchParams={props.searchParams}
    />
  ) : (
    <EmptyStateCard
      link="https://portal.thirdweb.com/typescript/v5/account-abstraction/get-started"
      metric="Account Abstraction"
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
      activeUsers: stat.totalUsers ?? 0,
      date: stat.date,
      feesCollected: fees,
      newUsers: stat.newUsers ?? 0,
      totalVolume: volume,
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
    activeUsers: { color: "hsl(var(--chart-1))", label: "Active Users" },
    feesCollected: {
      color: "hsl(var(--chart-4))",
      emptyContent: (
        <EmptyStateContent
          description="Your apps haven't collected any fees yet."
          link={"https://portal.thirdweb.com/payments"}
          metric="Fees"
        />
      ),
      isCurrency: true,
      label: "Fee Revenue",
    },
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
  } as const;

  return (
    <CombinedBarChartCard
      activeChart={
        (searchParams?.appHighlights as keyof AggregatedMetrics) ??
        "totalVolume"
      }
      aggregateFn={(_data, key) => {
        if (key === "activeUsers") {
          return Math.max(...timeSeriesData.map((d) => d[key]));
        }
        return timeSeriesData.reduce((acc, curr) => acc + curr[key], 0);
      }}
      chartConfig={chartConfig}
      data={timeSeriesData}
      existingQueryParams={searchParams}
      queryKey="appHighlights"
      title="App Highlights"
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

async function WalletDistributionCard({ data }: { data: WalletStats[] }) {
  const formattedData = await Promise.all(
    data
      .filter((w) => w.walletType !== "smart" && w.walletType !== "smartWallet")
      .map(async (w) => {
        const wallet = await getWalletInfo(w.walletType as WalletId).catch(
          () => ({ name: w.walletType }),
        );
        return {
          totalConnections: w.totalConnections,
          uniqueWalletsConnected: w.uniqueWalletsConnected,
          walletName: wallet.name,
          walletType: w.walletType,
        };
      }),
  );

  return (
    <PieChartCard
      data={formattedData.map(({ walletName, uniqueWalletsConnected }) => {
        return {
          label: walletName,
          value: uniqueWalletsConnected,
        };
      })}
      title="Wallets Connected"
    />
  );
}

function AuthMethodDistributionCard({ data }: { data: InAppWalletStats[] }) {
  return (
    <PieChartCard
      data={data.map(({ authenticationMethod, uniqueWalletsConnected }) => ({
        label: authenticationMethod,
        value: uniqueWalletsConnected,
      }))}
      title="Social Authentication"
    />
  );
}
