import {
  getInAppWalletUsage,
  getUserOpUsage,
  getWalletConnections,
  getWalletUsers,
} from "@/api/analytics";
import { redirect } from "next/navigation";

import type {
  InAppWalletStats,
  WalletStats,
  WalletUserStats,
} from "types/analytics";

import {
  type DurationId,
  type Range,
  getLastNDaysRange,
} from "components/analytics/date-range-selector";

import { type WalletId, getWalletInfo } from "thirdweb/wallets";
import { AnalyticsHeader } from "../../../../components/Analytics/AnalyticsHeader";
import { CombinedBarChartCard } from "../../../../components/Analytics/CombinedBarChartCard";
import { EmptyState } from "../../../../components/Analytics/EmptyState";
import { PieChartCard } from "../../../../components/Analytics/PieChartCard";

import { getTeamBySlug } from "@/api/team";
import { GenericLoadingPage } from "@/components/blocks/skeletons/GenericLoadingPage";
import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { getValidAccount } from "app/account/settings/getAccount";
import { EmptyStateCard } from "app/team/components/Analytics/EmptyStateCard";
import { Suspense } from "react";
import { TotalSponsoredChartCardUI } from "../../_components/TotalSponsoredCard";

// revalidate every 5 minutes
export const revalidate = 300;

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

  const account = await getValidAccount(`/team/${params.team_slug}`);
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
        <AnalyticsHeader title="Analytics" interval={interval} range={range} />
      </div>
      <div className="flex grow flex-col justify-between gap-10 md:container md:pt-8 md:pb-16">
        <Suspense fallback={<GenericLoadingPage />}>
          <OverviewPageContent
            account={account}
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
  account: Account;
  range: Range;
  interval: "day" | "week";
  searchParams: SearchParams;
}) {
  const { account, range, interval, searchParams } = props;

  const [
    walletConnections,
    walletUserStatsTimeSeries,
    inAppWalletUsage,
    userOpUsageTimeSeries,
    userOpUsage,
  ] = await Promise.all([
    // Aggregated wallet connections
    getWalletConnections({
      accountId: account.id,
      from: range.from,
      to: range.to,
      period: "all",
    }),
    // Time series data for wallet users
    getWalletUsers({
      accountId: account.id,
      from: range.from,
      to: range.to,
      period: interval,
    }),
    // In-app wallet usage
    getInAppWalletUsage({
      accountId: account.id,
      from: range.from,
      to: range.to,
      period: "all",
    }),
    // User operations usage
    getUserOpUsage({
      accountId: account.id,
      from: range.from,
      to: range.to,
      period: interval,
    }),
    getUserOpUsage({
      accountId: account.id,
      from: range.from,
      to: range.to,
      period: "all",
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
          <UsersChartCard
            userStats={walletUserStatsTimeSeries}
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
      {userOpUsage.length > 0 ? (
        <TotalSponsoredChartCardUI
          searchParams={searchParams}
          data={userOpUsageTimeSeries}
          aggregatedData={userOpUsage}
          className="max-md:rounded-none max-md:border-r-0 max-md:border-l-0"
        />
      ) : (
        <EmptyStateCard
          metric="Sponsored Transactions"
          link="https://portal.thirdweb.com/typescript/v5/account-abstraction/get-started"
        />
      )}
    </div>
  );
}

type UserMetrics = {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  returningUsers: number;
};

type TimeSeriesMetrics = UserMetrics & {
  date: string;
};

function processTimeSeriesData(
  userStats: WalletUserStats[],
): TimeSeriesMetrics[] {
  const metrics: TimeSeriesMetrics[] = [];

  let cumulativeUsers = 0;
  for (const stat of userStats) {
    cumulativeUsers += stat.newUsers ?? 0;
    metrics.push({
      date: stat.date,
      activeUsers: stat.totalUsers ?? 0,
      returningUsers: stat.returningUsers ?? 0,
      newUsers: stat.newUsers ?? 0,
      totalUsers: cumulativeUsers,
    });
  }

  return metrics;
}

function UsersChartCard({
  userStats,
  searchParams,
}: {
  userStats: WalletUserStats[];
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const timeSeriesData = processTimeSeriesData(userStats);

  const chartConfig = {
    activeUsers: { label: "Active Users", color: "hsl(var(--chart-1))" },
    totalUsers: { label: "Total Users", color: "hsl(var(--chart-2))" },
    newUsers: { label: "New Users", color: "hsl(var(--chart-3))" },
    returningUsers: {
      label: "Returning Users",
      color: "hsl(var(--chart-4))",
    },
  } as const;

  return (
    <CombinedBarChartCard
      className="max-md:rounded-none max-md:border-r-0 max-md:border-l-0"
      title="Users"
      chartConfig={chartConfig}
      activeChart={
        (searchParams?.usersChart as keyof UserMetrics) ?? "activeUsers"
      }
      data={timeSeriesData}
      aggregateFn={(_data, key) =>
        // If there is only one data point, use that one, otherwise use the previous
        timeSeriesData.filter((d) => (d[key] as number) > 0).length >= 2
          ? timeSeriesData[timeSeriesData.length - 2]?.[key]
          : timeSeriesData[timeSeriesData.length - 1]?.[key]
      }
      // Get the trend from the last two COMPLETE periods
      trendFn={(data, key) =>
        data.filter((d) => (d[key] as number) > 0).length >= 3
          ? ((data[data.length - 2]?.[key] as number) ?? 0) /
              ((data[data.length - 3]?.[key] as number) ?? 0) -
            1
          : undefined
      }
      queryKey="usersChart"
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
