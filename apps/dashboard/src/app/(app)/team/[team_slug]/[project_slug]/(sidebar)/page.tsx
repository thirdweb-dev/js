import { type Project, getProject } from "@/api/projects";
import { GenericLoadingPage } from "@/components/blocks/skeletons/GenericLoadingPage";
import { redirect } from "next/navigation";

import {
  type DurationId,
  type Range,
  getLastNDaysRange,
} from "components/analytics/date-range-selector";
import type {
  InAppWalletStats,
  UniversalBridgeStats,
  UserOpStats,
  WalletStats,
  WalletUserStats,
} from "types/analytics";

import {
  getInAppWalletUsage,
  getUniversalBridgeUsage,
  getUserOpUsage,
  getWalletConnections,
  getWalletUsers,
  isProjectActive,
} from "@/api/analytics";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import {
  EmptyStateCard,
  EmptyStateContent,
} from "app/(app)/team/components/Analytics/EmptyStateCard";
import { RangeSelector } from "components/analytics/range-selector";
import { Suspense } from "react";
import type { ThirdwebClient } from "thirdweb";
import {
  type ChainMetadata,
  defineChain,
  getChainMetadata,
} from "thirdweb/chains";
import { type WalletId, getWalletInfo } from "thirdweb/wallets";
import { getAuthToken } from "../../../../api/lib/getAuthToken";
import { loginRedirect } from "../../../../login/loginRedirect";
import { CombinedBarChartCard } from "../../../components/Analytics/CombinedBarChartCard";
import { PieChartCard } from "../../../components/Analytics/PieChartCard";
import { EngineCloudChartCard } from "./components/EngineCloudChartCard";
import { ProjectFTUX } from "./components/ProjectFTUX/ProjectFTUX";
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

export default async function ProjectOverviewPage(props: PageProps) {
  const [params, searchParams] = await Promise.all([
    props.params,
    props.searchParams,
  ]);

  const [authToken, project] = await Promise.all([
    getAuthToken(),
    getProject(params.team_slug, params.project_slug),
  ]);

  if (!authToken) {
    loginRedirect(`/team/${params.team_slug}`);
  }

  if (!project) {
    redirect(`/team/${params.team_slug}`);
  }

  const interval = (searchParams.interval as "day" | "week") ?? "week";
  const rangeType = (searchParams.type as DurationId) || "last-120";
  const range: Range = {
    from: new Date(searchParams.from ?? getLastNDaysRange("last-120").from),
    to: new Date(searchParams.to ?? getLastNDaysRange("last-120").to),
    type: rangeType,
  };

  const activeStatus = await isProjectActive({
    teamId: project.teamId,
    projectId: project.id,
  });

  const isActive = Object.values(activeStatus).some((v) => !!v);

  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: project.teamId,
  });

  return (
    <div className="flex grow flex-col">
      <div className="w-full border-b py-10">
        <div className="container max-w-7xl">
          <Header
            title={project.name}
            interval={interval}
            range={range}
            showRangeSelector={isActive}
          />
        </div>
      </div>

      <div className="h-6" />

      {!isActive ? (
        <div className="container max-w-7xl">
          <ProjectFTUX project={project} teamSlug={params.team_slug} />
        </div>
      ) : (
        <div className="container flex max-w-7xl grow flex-col">
          <Suspense fallback={<GenericLoadingPage />}>
            <ProjectAnalytics
              params={params}
              project={project}
              range={range}
              interval={interval}
              searchParams={searchParams}
              client={client}
            />
          </Suspense>
        </div>
      )}

      <div className="h-20" />
    </div>
  );
}

async function ProjectAnalytics(props: {
  project: Project;
  params: PageParams;
  range: Range;
  interval: "day" | "week";
  searchParams: PageSearchParams;
  client: ThirdwebClient;
}) {
  const { project, params, range, interval, searchParams, client } = props;

  // Fetch all analytics data in parallel
  const [
    walletConnections,
    walletUserStatsTimeSeries,
    inAppWalletUsage,
    userOpUsageTimeSeries,
    userOpUsage,
    universalBridgeUsage,
  ] = await Promise.allSettled([
    // Aggregated wallet connections
    getWalletConnections({
      teamId: project.teamId,
      projectId: project.id,
      from: range.from,
      to: range.to,
      period: "all",
    }),
    // Time series data for wallet users
    getWalletUsers({
      teamId: project.teamId,
      projectId: project.id,
      from: range.from,
      to: range.to,
      period: interval,
    }),
    // In-app wallet usage
    getInAppWalletUsage({
      teamId: project.teamId,
      projectId: project.id,
      from: range.from,
      to: range.to,
      period: "all",
    }),
    // User operations usage
    getUserOpUsage({
      teamId: project.teamId,
      projectId: project.id,
      from: range.from,
      to: range.to,
      period: interval,
    }),
    getUserOpUsage({
      teamId: project.teamId,
      projectId: project.id,
      from: range.from,
      to: range.to,
      period: "all",
    }),
    // Universal Bridge
    getUniversalBridgeUsage({
      teamId: project.teamId,
      projectId: project.id,
      from: range.from,
      to: range.to,
      period: interval,
    }),
  ]);

  return (
    <div className="flex grow flex-col gap-6">
      {walletUserStatsTimeSeries.status === "fulfilled" &&
      universalBridgeUsage.status === "fulfilled" &&
      walletUserStatsTimeSeries.value.some((w) => w.totalUsers !== 0) ? (
        <div className="">
          <AppHighlightsCard
            chartKey={
              (searchParams.appHighlights as keyof AggregatedMetrics) ??
              "totalVolume"
            }
            params={params}
            userStats={walletUserStatsTimeSeries.value}
            volumeStats={universalBridgeUsage.value}
            searchParams={searchParams}
          />
        </div>
      ) : (
        <EmptyStateCard
          metric="Connect"
          link="https://portal.thirdweb.com/connect/quickstart"
        />
      )}
      <div className="grid gap-6 md:grid-cols-2">
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
        teamId={project.teamId}
        client={client}
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
        teamId={project.teamId}
        projectId={project.id}
      />
      <EngineCloudChartCard
        from={range.from}
        to={range.to}
        period={interval}
        teamId={project.teamId}
        projectId={project.id}
      />
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

/**
 * Processes time series data to combine wallet and user statistics
 */
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
  chartKey,
  userStats,
  volumeStats,
  params,
  searchParams,
}: {
  chartKey: keyof AggregatedMetrics;
  userStats: WalletUserStats[];
  volumeStats: UniversalBridgeStats[];
  params: PageParams;
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
          description="Your app hasn't collected any fees yet."
          link={`/team/${params.team_slug}/${params.project_slug}/connect/universal-bridge/settings`}
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
      activeChart={chartKey}
      queryKey="appHighlights"
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

export function Header(props: {
  title: string;
  interval: "day" | "week";
  range: Range;
  showRangeSelector: boolean;
}) {
  const { title, interval, range, showRangeSelector } = props;

  return (
    <div className="flex flex-col items-start gap-3 md:flex-row md:items-center">
      <div className="flex-1">
        <h1 className="font-semibold text-2xl tracking-tight md:text-3xl">
          {title}
        </h1>
      </div>
      {showRangeSelector && <RangeSelector interval={interval} range={range} />}
    </div>
  );
}
