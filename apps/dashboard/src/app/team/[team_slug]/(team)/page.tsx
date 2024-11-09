import {
  getInAppWalletUsage,
  getUserOpUsage,
  getWalletConnections,
  getWalletUsers,
} from "@/api/analytics";
import { notFound, redirect } from "next/navigation";

import type {
  InAppWalletStats,
  UserOpStats,
  WalletStats,
  WalletUserStats,
} from "@/api/analytics";

import {
  type DurationId,
  type Range,
  getLastNDaysRange,
} from "components/analytics/date-range-selector";

import {
  type ChainMetadata,
  defineChain,
  getChainMetadata,
} from "thirdweb/chains";
import { type WalletId, getWalletInfo } from "thirdweb/wallets";
import { AnalyticsHeader } from "../../components/Analytics/AnalyticsHeader";
import { CombinedBarChartCard } from "../../components/Analytics/CombinedBarChartCard";
import { EmptyState } from "../../components/Analytics/EmptyState";
import { PieChartCard } from "../../components/Analytics/PieChartCard";

import { getTeamBySlug } from "@/api/team";
import { getAccount } from "app/account/settings/getAccount";
import { EmptyStateCard } from "app/team/components/Analytics/EmptyStateCard";
import { Changelog, type ChangelogItem } from "components/dashboard/Changelog";

// revalidate every 5 minutes
export const revalidate = 300;

export default async function TeamOverviewPage(props: {
  params: { team_slug: string };
  searchParams: {
    usersChart?: string;
    from?: string;
    to?: string;
    type?: string;
    interval?: string;
  };
}) {
  const changelog = await getChangelog();
  const [params, searchParams] = await Promise.all([
    props.params,
    props.searchParams,
  ]);

  const team = await getTeamBySlug(params.team_slug);
  const account = await getAccount();
  const interval = (searchParams.interval as "day" | "week") ?? "week";
  const rangeType = (searchParams.type as DurationId) || "last-120";
  const range: Range = {
    from: new Date(searchParams.from ?? getLastNDaysRange("last-120").from),
    to: new Date(searchParams.to ?? getLastNDaysRange("last-120").to),
    type: rangeType,
  };

  if (!team) {
    notFound();
  }

  if (!account) {
    redirect("/login");
  }

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

  return (
    <div>
      <div className="w-full border-border-800 border-b px-6 dark:bg-muted/50">
        <AnalyticsHeader
          title="Team Overview"
          interval={interval}
          range={range}
        />
      </div>
      <div className="flex flex-col justify-between gap-16 md:container md:pt-8 md:pb-16 xl:flex-row">
        <div className="grow">
          {isEmpty ? (
            <div className="container p-6">
              <EmptyState />
            </div>
          ) : (
            <div className="space-y-6">
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
                <div className="">
                  <TotalSponsoredCard
                    searchParams={searchParams}
                    data={userOpUsageTimeSeries}
                    aggregatedData={userOpUsage}
                  />
                </div>
              ) : (
                <EmptyStateCard
                  metric="Sponsored Transactions"
                  link="https://portal.thirdweb.com/typescript/v5/account-abstraction/get-started"
                />
              )}
            </div>
          )}
        </div>
        <div className="shrink-0 max-md:container max-xl:hidden lg:w-[320px]">
          <h2 className="mb-4 font-semibold text-lg tracking-tight">
            Latest changes
          </h2>
          <Changelog changelog={changelog} />
        </div>
      </div>
    </div>
  );
}

async function getChangelog() {
  const res = await fetch(
    "https://thirdweb.ghost.io/ghost/api/content/posts/?key=49c62b5137df1c17ab6b9e46e3&fields=title,url,published_at&filter=tag:changelog&visibility:public&limit=5",
  );
  const json = await res.json();
  return json.posts as ChangelogItem[];
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
      title="Users"
      chartConfig={chartConfig}
      activeChart={
        (searchParams?.usersChart as keyof UserMetrics) ?? "activeUsers"
      }
      data={timeSeriesData}
      aggregateFn={(_data, key) =>
        timeSeriesData[timeSeriesData.length - 2]?.[key]
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

async function TotalSponsoredCard({
  data,
  aggregatedData,
  searchParams,
}: {
  data: UserOpStats[];
  aggregatedData: UserOpStats[];
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const chains = await Promise.all(
    data.map(
      (item) =>
        // eslint-disable-next-line no-restricted-syntax
        item.chainId && getChainMetadata(defineChain(Number(item.chainId))),
    ),
  ).then((chains) => chains.filter((c) => c) as ChainMetadata[]);

  // Process data to combine by date and chain type
  const dateMap = new Map<string, { mainnet: number; testnet: number }>();
  for (const item of data) {
    const chain = chains.find((c) => c.chainId === Number(item.chainId));

    const existing = dateMap.get(item.date) || { mainnet: 0, testnet: 0 };
    if (chain?.testnet) {
      existing.testnet += item.sponsoredUsd;
    } else {
      existing.mainnet += item.sponsoredUsd;
    }
    dateMap.set(item.date, existing);
  }

  // Convert to array and sort by date
  const timeSeriesData = Array.from(dateMap.entries())
    .map(([date, values]) => ({
      date,
      mainnet: values.mainnet,
      testnet: values.testnet,
      total: values.mainnet + values.testnet,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const processedAggregatedData = {
    mainnet: aggregatedData
      .filter(
        (d) => !chains.find((c) => c.chainId === Number(d.chainId))?.testnet,
      )
      .reduce((acc, curr) => acc + curr.sponsoredUsd, 0),
    testnet: aggregatedData
      .filter(
        (d) => chains.find((c) => c.chainId === Number(d.chainId))?.testnet,
      )
      .reduce((acc, curr) => acc + curr.sponsoredUsd, 0),
    total: aggregatedData.reduce((acc, curr) => acc + curr.sponsoredUsd, 0),
  };

  const chartConfig = {
    mainnet: {
      label: "Mainnet Chains",
      color: "hsl(var(--chart-1))",
    },
    testnet: {
      label: "Testnet Chains",
      color: "hsl(var(--chart-2))",
    },
    total: {
      label: "All Chains",
      color: "hsl(var(--chart-3))",
    },
  };

  return (
    <CombinedBarChartCard
      isCurrency
      title="Total Sponsored"
      chartConfig={chartConfig}
      data={timeSeriesData}
      activeChart={
        (searchParams?.totalSponsored as keyof typeof chartConfig) ?? "mainnet"
      }
      queryKey="totalSponsored"
      existingQueryParams={searchParams}
      aggregateFn={(_data, key) => processedAggregatedData[key]}
      // Get the trend from the last two COMPLETE periods
      trendFn={(data, key) =>
        data.filter((d) => (d[key] as number) > 0).length >= 3
          ? ((data[data.length - 2]?.[key] as number) ?? 0) /
              ((data[data.length - 3]?.[key] as number) ?? 0) -
            1
          : undefined
      }
    />
  );
}
