import { EmptyStateCard } from "app/(app)/team/components/Analytics/EmptyStateCard";
import { redirect } from "next/navigation";
import {
  ResponsiveSearchParamsProvider,
  ResponsiveSuspense,
} from "responsive-rsc";
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
  isProjectActive,
} from "@/api/analytics";
import { getAuthToken } from "@/api/auth-token";
import { getProject, type Project } from "@/api/project/projects";
import type {
  DurationId,
  Range,
} from "@/components/analytics/date-range-selector";
import { LoadingChartState } from "@/components/analytics/empty-chart-state";
import { ResponsiveTimeFilters } from "@/components/analytics/responsive-time-filters";
import { ProjectAvatar } from "@/components/blocks/avatar/project-avatar";
import { ProjectPage } from "@/components/blocks/project-page/project-page";
import { getClientThirdwebClient } from "@/constants/thirdweb-client.client";
import { getProjectWallet } from "@/lib/server/project-wallet";
import { getFiltersFromSearchParams } from "@/lib/time";
import type {
  InAppWalletStats,
  UserOpStats,
  WalletStats,
} from "@/types/analytics";
import { loginRedirect } from "@/utils/redirects";
import { PieChartCard } from "../../../components/Analytics/PieChartCard";
import { EngineCloudChartCardAsync } from "./components/EngineCloudChartCard";
import { ProjectFTUX } from "./components/ProjectFTUX/ProjectFTUX";
import { ProjectWalletSection } from "./components/project-wallet/project-wallet";
import { RpcMethodBarChartCardAsync } from "./components/RpcMethodBarChartCard";
import { TransactionsChartCardAsync } from "./components/Transactions";
import { ProjectHighlightsCard } from "./overview/highlights-card";
import { TotalSponsoredCardUI } from "./overview/total-sponsored";

type PageParams = {
  team_slug: string;
  project_slug: string;
};

type PageSearchParams = {
  from: string | undefined | string[];
  to: string | undefined | string[];
  type: string | undefined | string[];
  interval: string | undefined | string[];
  appHighlights: string | undefined | string[];
  client_transactions: string | undefined | string[];
  totalSponsored: string | undefined | string[];
};

type PageProps = {
  params: Promise<PageParams>;
  searchParams: Promise<PageSearchParams>;
};

// Revalidate this page data every 30 seconds
export const revalidate = 30;

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

  const defaultRange: DurationId = "last-30";
  const { range, interval } = getFiltersFromSearchParams({
    defaultRange: "last-30",
    from: searchParams.from,
    interval: searchParams.interval,
    to: searchParams.to,
  });

  const activeStatus = await isProjectActive({
    authToken,
    projectId: project.id,
    teamId: project.teamId,
  });

  const isActive = Object.values(activeStatus).some((v) => !!v);

  const client = getClientThirdwebClient({
    jwt: authToken,
    teamId: project.teamId,
  });

  const projectWallet = await getProjectWallet(project);

  return (
    <ResponsiveSearchParamsProvider value={searchParams}>
      <ProjectPage
        header={{
          client,
          isProjectIcon: true,
          icon: () => (
            <ProjectAvatar
              className="size-12"
              client={client}
              src={project.image ?? ""}
            />
          ),
          title: project.name,
          description: "Your project's overview and analytics",
          // explicitly NO actions on the overview page
          actions: null,
        }}
      >
        <ProjectWalletSection
          project={project}
          teamSlug={params.team_slug}
          projectWallet={projectWallet}
          client={client}
        />

        <div className="h-10" />

        {isActive ? (
          <div className="flex flex-col gap-4 md:gap-6">
            <ResponsiveTimeFilters defaultRange={defaultRange} />
            <ProjectAnalytics
              authToken={authToken}
              client={client}
              interval={interval}
              params={params}
              project={project}
              range={range}
              searchParams={searchParams}
            />
          </div>
        ) : (
          <ProjectFTUX project={project} teamSlug={params.team_slug} />
        )}
      </ProjectPage>
    </ResponsiveSearchParamsProvider>
  );
}

async function ProjectAnalytics(props: {
  project: Project;
  params: PageParams;
  range: Range;
  interval: "day" | "week";
  searchParams: PageSearchParams;
  client: ThirdwebClient;
  authToken: string;
}) {
  const { project, params, range, interval, searchParams, client, authToken } =
    props;

  return (
    <div className="flex grow flex-col gap-6">
      <ResponsiveSuspense
        fallback={<LoadingChartState className="h-[458px] border" />}
        searchParamsUsed={["from", "to", "interval", "appHighlights"]}
      >
        <AsyncAppHighlightsCard
          authToken={authToken}
          client={client}
          interval={interval}
          params={params}
          project={project}
          range={range}
          selectedChart={
            typeof searchParams.appHighlights === "string"
              ? searchParams.appHighlights
              : undefined
          }
          selectedChartQueryParam="appHighlights"
        />
      </ResponsiveSuspense>

      <div className="grid gap-6 md:grid-cols-2">
        <ResponsiveSuspense
          fallback={<LoadingChartState className="h-[431px] border" />}
          searchParamsUsed={["from", "to", "interval"]}
        >
          <AsyncWalletDistributionCard
            project={project}
            range={range}
            authToken={authToken}
          />
        </ResponsiveSuspense>

        <ResponsiveSuspense
          fallback={<LoadingChartState className="h-[431px] border" />}
          searchParamsUsed={["from", "to", "interval"]}
        >
          <AsyncAuthMethodDistributionCard
            project={project}
            range={range}
            authToken={authToken}
          />
        </ResponsiveSuspense>
      </div>

      <ResponsiveSuspense
        fallback={<LoadingChartState className="h-[458px] border" />}
        searchParamsUsed={["from", "to", "interval", "client_transactions"]}
      >
        <TransactionsChartCardAsync
          client={client}
          params={{
            from: range.from,
            period: interval,
            projectId: project.id,
            teamId: project.teamId,
            to: range.to,
          }}
          authToken={authToken}
          selectedChart={
            typeof searchParams.client_transactions === "string"
              ? searchParams.client_transactions
              : undefined
          }
          selectedChartQueryParam="client_transactions"
        />
      </ResponsiveSuspense>

      <ResponsiveSuspense
        fallback={<LoadingChartState className="h-[458px] border" />}
        searchParamsUsed={["from", "to", "interval", "totalSponsored"]}
      >
        <AsyncTotalSponsoredCard
          interval={interval}
          project={project}
          range={range}
          selectedChart={
            typeof searchParams.totalSponsored === "string"
              ? searchParams.totalSponsored
              : undefined
          }
          selectedChartQueryParam="totalSponsored"
          authToken={authToken}
        />
      </ResponsiveSuspense>

      <ResponsiveSuspense
        fallback={<LoadingChartState className="h-[377px] border" />}
        searchParamsUsed={["from", "to", "interval"]}
      >
        <RpcMethodBarChartCardAsync
          params={{
            from: range.from,
            period: interval,
            projectId: project.id,
            teamId: project.teamId,
            to: range.to,
          }}
          authToken={authToken}
        />
      </ResponsiveSuspense>

      <ResponsiveSuspense
        fallback={<LoadingChartState className="h-[377px] border" />}
        searchParamsUsed={["from", "to", "interval"]}
      >
        <EngineCloudChartCardAsync
          params={{
            from: range.from,
            period: interval,
            projectId: project.id,
            teamId: project.teamId,
            to: range.to,
          }}
          authToken={authToken}
        />
      </ResponsiveSuspense>
    </div>
  );
}

export async function AsyncTotalSponsoredCard(props: {
  project: Project;
  range: Range;
  interval: "day" | "week";
  selectedChart: string | undefined;
  selectedChartQueryParam: string;
  authToken: string;
}) {
  const [userOpUsageTimeSeries, userOpUsage] = await Promise.allSettled([
    getUserOpUsage(
      {
        from: props.range.from,
        period: props.interval,
        projectId: props.project.id,
        teamId: props.project.teamId,
        to: props.range.to,
      },
      props.authToken,
    ),
    getUserOpUsage(
      {
        from: props.range.from,
        period: "all",
        projectId: props.project.id,
        teamId: props.project.teamId,
        to: props.range.to,
      },
      props.authToken,
    ),
  ]);

  return userOpUsageTimeSeries.status === "fulfilled" &&
    userOpUsage.status === "fulfilled" &&
    userOpUsage.value.length > 0 ? (
    <TotalSponsoredCard
      aggregatedData={userOpUsage.value}
      data={userOpUsageTimeSeries.value}
      selectedChart={props.selectedChart}
      selectedChartQueryParam={props.selectedChartQueryParam}
    />
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
  authToken: string;
}) {
  const inAppWalletUsage = await getInAppWalletUsage(
    {
      from: props.range.from,
      period: "all",
      projectId: props.project.id,
      teamId: props.project.teamId,
      to: props.range.to,
    },
    props.authToken,
  ).catch(() => undefined);

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
  selectedChartQueryParam: string;
  selectedChart: string | undefined;
  client: ThirdwebClient;
  params: PageParams;
  authToken: string;
}) {
  const [aggregatedUserStats, walletUserStatsTimeSeries, universalBridgeUsage] =
    await Promise.allSettled([
      getInAppWalletUsage(
        {
          from: props.range.from,
          period: "all",
          projectId: props.project.id,
          teamId: props.project.teamId,
          to: props.range.to,
        },
        props.authToken,
      ),
      getInAppWalletUsage(
        {
          from: props.range.from,
          period: props.interval,
          projectId: props.project.id,
          teamId: props.project.teamId,
          to: props.range.to,
        },
        props.authToken,
      ),
      getUniversalBridgeUsage(
        {
          from: props.range.from,
          period: props.interval,
          projectId: props.project.id,
          teamId: props.project.teamId,
          to: props.range.to,
        },
        props.authToken,
      ),
    ]);

  if (
    walletUserStatsTimeSeries.status === "fulfilled" &&
    universalBridgeUsage.status === "fulfilled"
  ) {
    return (
      <ProjectHighlightsCard
        aggregatedUserStats={
          aggregatedUserStats.status === "fulfilled"
            ? aggregatedUserStats.value
            : []
        }
        selectedChart={props.selectedChart}
        selectedChartQueryParam={props.selectedChartQueryParam}
        teamSlug={props.params.team_slug}
        projectSlug={props.params.project_slug}
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
  project: Project;
  range: Range;
  authToken: string;
}) {
  const walletConnections = await getWalletConnections(
    {
      from: props.range.from,
      period: "all",
      projectId: props.project.id,
      teamId: props.project.teamId,
      to: props.range.to,
    },
    props.authToken,
  ).catch(() => undefined);

  return walletConnections && walletConnections.length > 0 ? (
    <WalletDistributionCard data={walletConnections} />
  ) : (
    <EmptyStateCard
      link="https://portal.thirdweb.com/wallets/external-wallets"
      metric="External Wallets"
    />
  );
}

async function WalletDistributionCard({ data }: { data: WalletStats[] }) {
  const formattedData = await Promise.all(
    data.map(async (w) => {
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
      title="External Wallets Connected"
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
  selectedChart,
  selectedChartQueryParam,
}: {
  data: UserOpStats[];
  aggregatedData: UserOpStats[];
  selectedChart: string | undefined;
  selectedChartQueryParam: string;
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

  return (
    <TotalSponsoredCardUI
      processedAggregatedData={processedAggregatedData}
      selectedChart={selectedChart}
      selectedChartQueryParam={selectedChartQueryParam}
      timeSeriesData={timeSeriesData}
    />
  );
}

export function Header(props: {
  title: string;
  showRangeSelector: boolean;
  defaultRange: DurationId;
}) {
  const { title, showRangeSelector, defaultRange } = props;

  return (
    <div className="flex flex-col items-start gap-3 md:flex-row md:items-center">
      <div className="flex-1">
        <h1 className="font-semibold text-2xl tracking-tight md:text-3xl">
          {title}
        </h1>
      </div>
      {showRangeSelector && (
        <div className="max-sm:w-full">
          <ResponsiveTimeFilters defaultRange={defaultRange} />
        </div>
      )}
    </div>
  );
}
