import { notFound } from "next/navigation";

import { getProject } from "@/api/projects";
import { getThirdwebClient } from "@/constants/thirdweb.server";
import { fetchAnalytics } from "data/analytics/fetch-analytics";

import type {
  InAppWalletStats,
  UserOpStatsByChain,
  WalletStats,
  WalletUserStats,
} from "@3rdweb-sdk/react/hooks/useApi";
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

import { resolveSchemeWithErrorHandler } from "@/lib/resolveSchemeWithErrorHandler";
import { AnalyticsHeader } from "../../components/Analytics/AnalyticsHeader";
import { CombinedBarChartCard } from "../../components/Analytics/CombinedBarChartCard";
import { EmptyState } from "../../components/Analytics/EmptyState";
import { PieChartCard } from "../../components/Analytics/PieChartCard";
import { StatBreakdownCard } from "../../components/Analytics/StatBreakdownCard";

type PageParams = {
  team_slug: string;
  project_slug: string;
};

type PageSearchParams = {
  usersChart?: string;
  from?: string;
  to?: string;
  type?: string;
  interval?: string;
};

type PageProps = {
  params: Promise<PageParams>;
  searchParams: Promise<PageSearchParams>;
};

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

  // Fetch all analytics data in parallel
  const [
    walletConnections,
    walletUserStatsTimeSeries,
    inAppWalletUsage,
    userOpUsage,
  ] = await Promise.all([
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
      period: "all",
    }),
  ]);

  const isEmpty =
    !walletUserStatsTimeSeries.some((w) => w.totalUsers !== 0) &&
    walletConnections.length === 0 &&
    inAppWalletUsage.length === 0 &&
    userOpUsage.length === 0;

  return (
    <div className="pb-16">
      <div className="w-full border-border-800 border-b px-6 dark:bg-muted/50">
        <AnalyticsHeader
          title={project.name}
          interval={interval}
          range={range}
        />
      </div>
      {isEmpty ? (
        <div className="container p-6">
          <EmptyState />
        </div>
      ) : (
        <div className="space-y-6 md:container md:p-6">
          {walletUserStatsTimeSeries.some((w) => w.totalUsers !== 0) && (
            <div className="">
              <UsersChartCard
                chartKey={
                  (searchParams.usersChart as
                    | "totalUsers"
                    | "activeUsers"
                    | "newUsers"
                    | "returningUsers") ?? "activeUsers"
                }
                userStats={walletUserStatsTimeSeries}
                searchParams={searchParams}
              />
            </div>
          )}
          <div className="grid gap-6 max-md:px-6 md:grid-cols-2">
            {walletConnections.length > 0 && (
              <WalletDistributionCard data={walletConnections} />
            )}
            {inAppWalletUsage.length > 0 && (
              <AuthMethodDistributionCard data={inAppWalletUsage} />
            )}
          </div>
          {userOpUsage.length > 0 && (
            <div className="grid gap-6 max-md:px-6 max-md:pb-6 md:grid-cols-2">
              <TotalSponsoredCard data={userOpUsage} />
              <UserOpUsageCard data={userOpUsage} />
            </div>
          )}
        </div>
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
      title="Users"
      chartConfig={chartConfig}
      activeChart={chartKey}
      data={timeSeriesData}
      aggregateFn={(_data, key) =>
        timeSeriesData[timeSeriesData.length - 1]?.[key]
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

async function TotalSponsoredCard({ data }: { data: UserOpStatsByChain[] }) {
  const chains = await Promise.all(
    data.map(
      (item) =>
        // eslint-disable-next-line no-restricted-syntax
        item.chainId && getChainMetadata(defineChain(Number(item.chainId))),
    ),
  ).then((chains) => chains.filter((c) => c) as ChainMetadata[]);

  return (
    <StatBreakdownCard
      title="Total Sponsored"
      isCurrency
      data={data
        .sort((a, b) => b.sponsoredUsd - a.sponsoredUsd)
        .map((item, index) => {
          const chain = chains.find((c) => c.chainId === Number(item.chainId));
          return {
            label: chain?.name || item.chainId || "Unknown",
            value: item.sponsoredUsd,
            icon: chain?.icon?.url ? (
              <div className="flex size-4 items-center justify-center">
                <img
                  src={resolveSchemeWithErrorHandler({
                    client: getThirdwebClient(),
                    uri: chain?.icon.url,
                  })}
                  width={chain?.icon?.width}
                  height={chain?.icon?.height}
                  className="h-4 w-auto"
                  alt=""
                />
              </div>
            ) : undefined,
            fill: `hsl(var(--chart-${index + 1}))`,
          };
        })}
    />
  );
}

async function UserOpUsageCard({ data }: { data: UserOpStatsByChain[] }) {
  const chains = await Promise.all(
    data.map(
      (item) =>
        // eslint-disable-next-line no-restricted-syntax
        item.chainId && getChainMetadata(defineChain(Number(item.chainId))),
    ),
  ).then((chains) => chains.filter((c) => c) as ChainMetadata[]);

  return (
    <StatBreakdownCard
      title="User Operations"
      data={data
        .sort((a, b) => b.successful - a.successful)
        .map((item, index) => {
          const chain = chains.find((c) => c.chainId === Number(item.chainId));

          return {
            label: chain?.name || item.chainId || "Unknown",
            value: item.successful + item.failed,
            icon: chain?.icon?.url ? (
              <div className="flex size-4 items-center justify-center">
                <img
                  src={resolveSchemeWithErrorHandler({
                    client: getThirdwebClient(),
                    uri: chain.icon.url,
                  })}
                  width={chain?.icon?.width}
                  height={chain?.icon?.height}
                  className="h-4 w-auto"
                  alt=""
                />
              </div>
            ) : undefined,
            fill: `hsl(var(--chart-${index + 1}))`,
          };
        })}
    />
  );
}

export async function getWalletConnections(args: {
  clientId: string;
  from?: Date;
  to?: Date;
  period?: "day" | "week" | "month" | "year" | "all";
}): Promise<WalletStats[]> {
  const { clientId, from, to, period } = args;

  const searchParams = new URLSearchParams();
  searchParams.append("clientId", clientId);
  if (from) {
    searchParams.append("from", from.toISOString());
  }
  if (to) {
    searchParams.append("to", to.toISOString());
  }
  if (period) {
    searchParams.append("period", period);
  }
  const res = await fetchAnalytics(`v1/wallets?${searchParams.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (res?.status !== 200) {
    console.error("Failed to fetch wallet connections");
    return [];
  }

  const json = await res.json();

  return json.data as WalletStats[];
}

export async function getInAppWalletUsage(args: {
  clientId: string;
  from?: Date;
  to?: Date;
  period?: "day" | "week" | "month" | "year" | "all";
}): Promise<InAppWalletStats[]> {
  const { clientId, from, to, period } = args;

  const searchParams = new URLSearchParams();
  searchParams.append("clientId", clientId);
  if (from) {
    searchParams.append("from", from.toISOString());
  }
  if (to) {
    searchParams.append("to", to.toISOString());
  }
  if (period) {
    searchParams.append("period", period);
  }
  const res = await fetchAnalytics(
    `v1/wallets/in-app?${searchParams.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (res?.status !== 200) {
    console.error("Failed to fetch in-app wallet usage");
    return [];
  }

  const json = await res.json();

  return json.data as InAppWalletStats[];
}

async function getUserOpUsage(args: {
  clientId: string;
  from?: Date;
  to?: Date;
  period?: "day" | "week" | "month" | "year" | "all";
}) {
  const { clientId, from, to, period } = args;

  const searchParams = new URLSearchParams();
  searchParams.append("clientId", clientId);
  if (from) {
    searchParams.append("from", from.toISOString());
  }
  if (to) {
    searchParams.append("to", to.toISOString());
  }
  if (period) {
    searchParams.append("period", period);
  }
  const res = await fetchAnalytics(`v1/user-ops?${searchParams.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await res.json();

  if (res.status !== 200) {
    console.error("Failed to fetch user ops usage");
    return [];
  }

  return json.data as UserOpStatsByChain[];
}

async function getWalletUsers(args: {
  clientId: string;
  from?: Date;
  to?: Date;
  period?: "day" | "week" | "month" | "year" | "all";
}): Promise<WalletUserStats[]> {
  const { clientId, from, to, period } = args;

  const searchParams = new URLSearchParams();
  searchParams.append("clientId", clientId);
  if (from) {
    searchParams.append("from", from.toISOString());
  }
  if (to) {
    searchParams.append("to", to.toISOString());
  }
  if (period) {
    searchParams.append("period", period);
  }
  const res = await fetchAnalytics(
    `v1/wallets/users?${searchParams.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (res?.status !== 200) {
    console.error("Failed to fetch wallet user stats");
    return [];
  }

  const json = await res.json();

  return json.data as WalletUserStats[];
}
