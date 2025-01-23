import { type Project, getProject } from "@/api/projects";
import { GenericLoadingPage } from "@/components/blocks/skeletons/GenericLoadingPage";
import { notFound } from "next/navigation";

import {
  type DurationId,
  type Range,
  getLastNDaysRange,
} from "components/analytics/date-range-selector";
import type {
  InAppWalletStats,
  UserOpStats,
  WalletStats,
  WalletUserStats,
} from "types/analytics";

import {
  getInAppWalletUsage,
  getUserOpUsage,
  getWalletConnections,
  getWalletUsers,
  isProjectActive,
} from "@/api/analytics";
import { EmptyStateCard } from "app/team/components/Analytics/EmptyStateCard";
import { Suspense } from "react";
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
import { RpcMethodBarChartCard } from "./components/RpcMethodBarChartCard";
import { TransactionsCharts } from "./components/Transactions";

interface PageParams {
  team_slug: string;
  project_slug: string;
}

interface PageSearchParams {
  [key: string]: string | undefined;
}

interface PageProps {
  params: Promise<PageParams>;
  searchParams: Promise<PageSearchParams>;
}

export const maxDuration = 300;

export default async function ProjectOverviewPage(props: PageProps) {
  const [params, searchParams] = await Promise.all([
    props.params,
    props.searchParams,
  ]);

  const project = await getProject(params.team_slug, params.project_slug);
  const interval = (searchParams.interval as "day" | "week") ?? "week";
  const rangeType = (searchParams.type as DurationId) || "last-120";
  const range: Range = {
    from: new Date(searchParams.from ?? getLastNDaysRange("last-120").from),
    to: new Date(searchParams.to ?? getLastNDaysRange("last-120").to),
    type: rangeType,
  };

  if (!project) {
    notFound();
  }

  const isActive = await isProjectActive({ clientId: project.publishableKey });

  return (
    <div className="flex grow flex-col">
      <div className="w-full border-border border-b">
        <AnalyticsHeader
          title={project.name}
          interval={interval}
          range={range}
        />
      </div>
      {!isActive ? (
        <div className="container p-6">
          <EmptyState />
        </div>
      ) : (
        <div className="container flex grow flex-col py-6">
          <Suspense fallback={<GenericLoadingPage />}>
            <ProjectAnalytics
              project={project}
              range={range}
              interval={interval}
              searchParams={searchParams}
            />
          </Suspense>
        </div>
      )}
    </div>
  );
}

async function ProjectAnalytics(props: {
  project: Project;
  range: Range;
  interval: "day" | "week";
  searchParams: PageSearchParams;
}) {
  const { project, range, interval, searchParams } = props;

  // Fetch all analytics data in parallel
  const [
    walletConnections,
    walletUserStatsTimeSeries,
    inAppWalletUsage,
    userOpUsageTimeSeries,
    userOpUsage,
  ] = await Promise.allSettled([
    // Aggregated wallet connections
    getWalletConnections({
      clientId: project.publishableKey,
      from: range.from,
      to: range.to,
      period: "all",
    }),
    // Time series data for wallet users
    getWalletUsers({
      clientId: project.publishableKey,
      from: range.from,
      to: range.to,
      period: interval,
    }),
    // In-app wallet usage
    getInAppWalletUsage({
      clientId: project.publishableKey,
      from: range.from,
      to: range.to,
      period: "all",
    }),
    // User operations usage
    getUserOpUsage({
      clientId: project.publishableKey,
      from: range.from,
      to: range.to,
      period: interval,
    }),
    getUserOpUsage({
      clientId: project.publishableKey,
      from: range.from,
      to: range.to,
      period: "all",
    }),
  ]);

  return (
    <div className="flex grow flex-col gap-6">
      {walletUserStatsTimeSeries.status === "fulfilled" &&
      walletUserStatsTimeSeries.value.some((w) => w.totalUsers !== 0) ? (
        <div className="">
          <UsersChartCard
            chartKey={
              (searchParams.usersChart as
                | "totalUsers"
                | "activeUsers"
                | "newUsers"
                | "returningUsers") ?? "activeUsers"
            }
            userStats={walletUserStatsTimeSeries.value}
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
        {walletConnections.status === "fulfilled" &&
        walletConnections.value.length > 0 ? (
          <WalletDistributionCard data={walletConnections.value} />
        ) : (
          <EmptyStateCard
            metric="Connect"
            link="https://portal.thirdweb.com/connect/quickstart"
          />
        )}
        {inAppWalletUsage.status === "fulfilled" &&
        inAppWalletUsage.value.length > 0 ? (
          <AuthMethodDistributionCard data={inAppWalletUsage.value} />
        ) : (
          <EmptyStateCard
            metric="In-App Wallets"
            link="https://portal.thirdweb.com/typescript/v5/inAppWallet"
          />
        )}
      </div>
      <TransactionsCharts
        searchParams={searchParams}
        from={range.from}
        to={range.to}
        period={interval}
        clientId={project.publishableKey}
      />
      {userOpUsageTimeSeries.status === "fulfilled" &&
      userOpUsage.status === "fulfilled" &&
      userOpUsage.value.length > 0 ? (
        <div className="">
          <TotalSponsoredCard
            searchParams={searchParams}
            data={userOpUsageTimeSeries.value}
            aggregatedData={userOpUsage.value}
          />
        </div>
      ) : (
        <EmptyStateCard
          metric="Sponsored Transactions"
          link="https://portal.thirdweb.com/typescript/v5/account-abstraction/get-started"
        />
      )}
      <RpcMethodBarChartCard
        from={range.from}
        to={range.to}
        period={interval}
        clientId={project.publishableKey}
      />
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

/**
 * Processes time series data to combine wallet and user statistics
 */
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
  chartKey,
  userStats,
  searchParams,
}: {
  chartKey: keyof UserMetrics;
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
      activeChart={chartKey}
      queryKey="usersChart"
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
      title="Gas Sponsored"
      chartConfig={chartConfig}
      className="max-md:rounded-none max-md:border-r-0 max-md:border-l-0"
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
