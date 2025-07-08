import {
  EmptyStateCard,
  EmptyStateContent,
} from "app/(app)/team/components/Analytics/EmptyStateCard";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import type { ThirdwebClient } from "thirdweb";
import {
  type ChainMetadata,
  defineChain,
  getChainMetadata,
} from "thirdweb/chains";
import { getWalletInfo, type WalletId } from "thirdweb/wallets";
import {
  getInAppWalletUsage,
  getUniversalBridgeUsage,
  getUserOpUsage,
  getWalletConnections,
  getWalletUsers,
  isProjectActive,
} from "@/api/analytics";
import { getAuthToken } from "@/api/auth-token";
import { getProject, type Project } from "@/api/projects";
import {
  type DurationId,
  getLastNDaysRange,
  type Range,
} from "@/components/analytics/date-range-selector";
import { LoadingChartState } from "@/components/analytics/empty-chart-state";
import { RangeSelector } from "@/components/analytics/range-selector";
import { GenericLoadingPage } from "@/components/blocks/skeletons/GenericLoadingPage";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import type {
  InAppWalletStats,
  UniversalBridgeStats,
  UserOpStats,
  WalletStats,
  WalletUserStats,
} from "@/types/analytics";
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
    projectId: project.id,
    teamId: project.teamId,
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
            interval={interval}
            range={range}
            showRangeSelector={isActive}
            title={project.name}
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
              client={client}
              interval={interval}
              params={params}
              project={project}
              range={range}
              searchParams={searchParams}
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

  return (
    <div className="flex grow flex-col gap-6">
      <Suspense fallback={<LoadingChartState className="h-[458px] border" />}>
        <AsyncAppHighlightsCard
          client={client}
          interval={interval}
          params={params}
          project={project}
          range={range}
          searchParams={searchParams}
        />
      </Suspense>

      <div className="grid gap-6 md:grid-cols-2">
        <Suspense fallback={<LoadingChartState className="h-[431px] border" />}>
          <AsyncWalletDistributionCard project={project} range={range} />
        </Suspense>

        <Suspense fallback={<LoadingChartState className="h-[431px] border" />}>
          <AsyncAuthMethodDistributionCard project={project} range={range} />
        </Suspense>
      </div>

      <TransactionsCharts
        client={client}
        from={range.from}
        period={interval}
        searchParams={searchParams}
        teamId={project.teamId}
        to={range.to}
      />

      <Suspense fallback={<LoadingChartState className="h-[458px] border" />}>
        <AsyncTotalSponsoredCard
          interval={interval}
          project={project}
          range={range}
          searchParams={searchParams}
        />
      </Suspense>

      <RpcMethodBarChartCard
        from={range.from}
        period={interval}
        projectId={project.id}
        teamId={project.teamId}
        to={range.to}
      />
      <EngineCloudChartCard
        from={range.from}
        period={interval}
        projectId={project.id}
        teamId={project.teamId}
        to={range.to}
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

export async function AsyncTotalSponsoredCard(props: {
  project: Project;
  range: Range;
  interval: "day" | "week";
  searchParams: PageSearchParams;
}) {
  const [userOpUsageTimeSeries, userOpUsage] = await Promise.allSettled([
    getUserOpUsage({
      from: props.range.from,
      period: props.interval,
      projectId: props.project.id,
      teamId: props.project.teamId,
      to: props.range.to,
    }),
    getUserOpUsage({
      from: props.range.from,
      period: "all",
      projectId: props.project.id,
      teamId: props.project.teamId,
      to: props.range.to,
    }),
  ]);

  return userOpUsageTimeSeries.status === "fulfilled" &&
    userOpUsage.status === "fulfilled" &&
    userOpUsage.value.length > 0 ? (
    <div className="">
      <TotalSponsoredCard
        aggregatedData={userOpUsage.value}
        data={userOpUsageTimeSeries.value}
        searchParams={props.searchParams}
      />
    </div>
  ) : (
    <EmptyStateCard
      link="https://portal.thirdweb.com/typescript/v5/account-abstraction/get-started"
      metric="Account Abstraction"
    />
  );
}

async function AsyncAuthMethodDistributionCard(props: {
  project: Project;
  range: Range;
}) {
  const inAppWalletUsage = await getInAppWalletUsage({
    from: props.range.from,
    period: "all",
    projectId: props.project.id,
    teamId: props.project.teamId,
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

async function AsyncAppHighlightsCard(props: {
  project: Project;
  range: Range;
  interval: "day" | "week";
  searchParams: PageSearchParams;
  client: ThirdwebClient;
  params: PageParams;
}) {
  const [walletUserStatsTimeSeries, universalBridgeUsage] =
    await Promise.allSettled([
      getWalletUsers({
        from: props.range.from,
        period: props.interval,
        projectId: props.project.id,
        teamId: props.project.teamId,
        to: props.range.to,
      }),
      getUniversalBridgeUsage({
        from: props.range.from,
        period: props.interval,
        projectId: props.project.id,
        teamId: props.project.teamId,
        to: props.range.to,
      }),
    ]);

  if (
    walletUserStatsTimeSeries.status === "fulfilled" &&
    universalBridgeUsage.status === "fulfilled"
  )
    return (
      <div>
        <AppHighlightsCard
          chartKey={
            (props.searchParams.appHighlights as keyof AggregatedMetrics) ??
            "totalVolume"
          }
          params={props.params}
          searchParams={props.searchParams}
          userStats={
            walletUserStatsTimeSeries.status === "fulfilled"
              ? walletUserStatsTimeSeries.value
              : []
          }
          volumeStats={
            universalBridgeUsage.status === "fulfilled"
              ? universalBridgeUsage.value
              : []
          }
        />
      </div>
    );

  return (
    <EmptyStateCard
      link="https://portal.thirdweb.com/wallets/quickstart"
      metric="Wallets"
    />
  );
}

async function AsyncWalletDistributionCard(props: {
  project: Project;
  range: Range;
}) {
  const walletConnections = await getWalletConnections({
    from: props.range.from,
    period: "all",
    projectId: props.project.id,
    teamId: props.project.teamId,
    to: props.range.to,
  }).catch(() => undefined);

  return walletConnections && walletConnections.length > 0 ? (
    <WalletDistributionCard data={walletConnections} />
  ) : (
    <EmptyStateCard
      link="https://portal.thirdweb.com/wallets/quickstart"
      metric="Wallets"
    />
  );
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
    activeUsers: { color: "hsl(var(--chart-1))", label: "Active Users" },
    feesCollected: {
      color: "hsl(var(--chart-4))",
      emptyContent: (
        <EmptyStateContent
          description="Your app hasn't collected any fees yet."
          link={`/team/${params.team_slug}/${params.project_slug}/connect/universal-bridge/settings`}
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
          description="Onramp, swap, and bridge with thirdweb's Universal Bridge."
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
      activeChart={chartKey}
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
      color: "hsl(var(--chart-1))",
      label: "Mainnet Chains",
    },
    testnet: {
      color: "hsl(var(--chart-2))",
      label: "Testnet Chains",
    },
    total: {
      color: "hsl(var(--chart-3))",
      label: "All Chains",
    },
  };

  return (
    <CombinedBarChartCard
      activeChart={
        (searchParams?.totalSponsored as keyof typeof chartConfig) ?? "mainnet"
      }
      aggregateFn={(_data, key) => processedAggregatedData[key]}
      chartConfig={chartConfig}
      data={timeSeriesData}
      existingQueryParams={searchParams}
      isCurrency
      queryKey="totalSponsored"
      title="Gas Sponsored"
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
      {showRangeSelector && (
        <div className="max-sm:w-full">
          <RangeSelector interval={interval} range={range} />
        </div>
      )}
    </div>
  );
}
