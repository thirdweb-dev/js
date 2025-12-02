import { EmptyStateCard } from "app/(app)/team/components/Analytics/EmptyStateCard";
import { redirect } from "next/navigation";
import {
  ResponsiveSearchParamsProvider,
  ResponsiveSuspense,
} from "responsive-rsc";
import type { ThirdwebClient } from "thirdweb";
import {
  getAiUsage,
  getInAppWalletUsage,
  getInsightStatusCodeUsage,
  getRpcUsageByType,
  getUniversalBridgeUsage,
  getX402Settlements,
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
import { loginRedirect } from "@/utils/redirects";
import { AiTokenUsageChartCardUI } from "./ai/analytics/chart/AiTokenUsageChartCard";
import { ProjectFTUX } from "./components/ProjectFTUX/ProjectFTUX";
import { ProjectWalletSection } from "./components/project-wallet/project-wallet";
import { TransactionsChartCardAsync } from "./components/Transactions";
import { RequestsByStatusGraph } from "./gateway/indexer/components/RequestsByStatusGraph";
import { RPCRequestsChartUI } from "./gateway/rpc/components/RequestsGraph";
import { ProjectHighlightsCard } from "./overview/highlights-card";
import { AllWalletConnectionsChart } from "./wallets/analytics/chart/all-wallet-connections-chart";
import { X402RequestsChartCardUI } from "./x402/analytics/x402-requests-chart";

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
              className="size-11"
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
        {isActive ? (
          <div className="flex flex-col gap-4 md:gap-10">
            <ProjectWalletSection
              project={project}
              teamSlug={params.team_slug}
              projectWallet={projectWallet}
              client={client}
              layout="column"
            />
            <div className="flex flex-col gap-4">
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
          </div>
        ) : (
          <div className="pt-6">
            <ProjectFTUX
              project={project}
              teamSlug={params.team_slug}
              projectWalletSection={
                <ProjectWalletSection
                  project={project}
                  teamSlug={params.team_slug}
                  projectWallet={projectWallet}
                  client={client}
                  layout="row"
                />
              }
            />
          </div>
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
      {/* project highlights */}
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

      {/* wallet connections */}
      <AllWalletConnectionsChart
        teamSlug={params.team_slug}
        projectSlug={params.project_slug}
        authToken={authToken}
        projectId={project.id}
        from={range.from}
        to={range.to}
        interval={interval}
        teamId={project.teamId}
      />

      {/* indexer and RPC requests */}
      <div className="grid gap-6 md:grid-cols-2">
        <ResponsiveSuspense
          fallback={
            <RequestsByStatusGraph
              data={[]}
              isPending={true}
              viewMoreLink={`/team/${params.team_slug}/${params.project_slug}/gateway/indexer`}
            />
          }
          searchParamsUsed={["from", "to", "interval"]}
        >
          <AsyncIndexerRequestsChartCard
            teamSlug={params.team_slug}
            projectSlug={params.project_slug}
            from={range.from}
            to={range.to}
            interval={interval}
            projectId={project.id}
            teamId={project.teamId}
            authToken={authToken}
          />
        </ResponsiveSuspense>

        <ResponsiveSuspense
          fallback={
            <RPCRequestsChartUI
              isPending={true}
              data={[]}
              viewMoreLink={`/team/${params.team_slug}/${params.project_slug}/gateway/rpc`}
            />
          }
          searchParamsUsed={["from", "to", "interval"]}
        >
          <AsyncRPCRequestsChartCard
            teamSlug={params.team_slug}
            projectSlug={params.project_slug}
            from={range.from}
            to={range.to}
            interval={interval}
            projectId={project.id}
            teamId={project.teamId}
            authToken={authToken}
          />
        </ResponsiveSuspense>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* x402 */}
        <ResponsiveSuspense
          searchParamsUsed={["from", "to", "interval"]}
          fallback={
            <X402RequestsChartCardUI
              stats={[]}
              isPending={true}
              teamSlug={params.team_slug}
              projectSlug={params.project_slug}
            />
          }
        >
          <AsyncX402RequestsChart
            from={range.from}
            teamSlug={params.team_slug}
            projectSlug={params.project_slug}
            to={range.to}
            interval={interval}
            projectId={project.id}
            teamId={project.teamId}
            authToken={authToken}
          />
        </ResponsiveSuspense>

        {/* AI tokens */}
        <ResponsiveSuspense
          fallback={
            <AiTokenUsageChartCardUI
              isPending={true}
              title="AI token volume"
              viewMoreLink={`/team/${params.team_slug}/${params.project_slug}/ai/analytics`}
              aiUsageStats={[]}
            />
          }
          searchParamsUsed={["from", "to", "interval"]}
        >
          <AsyncAiAnalytics
            teamSlug={params.team_slug}
            projectSlug={params.project_slug}
            from={range.from}
            to={range.to}
            interval={interval}
            projectId={project.id}
            teamId={project.teamId}
            authToken={authToken}
          />
        </ResponsiveSuspense>
      </div>

      {/* transactions */}
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
    </div>
  );
}

async function AsyncIndexerRequestsChartCard(props: {
  from: Date;
  to: Date;
  interval: "day" | "week";
  projectId: string;
  teamId: string;
  authToken: string;
  teamSlug: string;
  projectSlug: string;
}) {
  const requestsData = await getInsightStatusCodeUsage(
    {
      from: props.from,
      period: props.interval,
      projectId: props.projectId,
      teamId: props.teamId,
      to: props.to,
    },
    props.authToken,
  ).catch(() => undefined);

  return (
    <RequestsByStatusGraph
      data={requestsData && "data" in requestsData ? requestsData.data : []}
      isPending={false}
      viewMoreLink={`/team/${props.teamSlug}/${props.projectSlug}/gateway/indexer`}
    />
  );
}

async function AsyncRPCRequestsChartCard(props: {
  from: Date;
  to: Date;
  interval: "day" | "week";
  projectId: string;
  teamId: string;
  authToken: string;
  teamSlug: string;
  projectSlug: string;
}) {
  const requestsData = await getRpcUsageByType(
    {
      from: props.from,
      period: props.interval,
      projectId: props.projectId,
      teamId: props.teamId,
      to: props.to,
    },
    props.authToken,
  ).catch(() => undefined);

  return (
    <RPCRequestsChartUI
      isPending={false}
      data={requestsData || []}
      viewMoreLink={`/team/${props.teamSlug}/${props.projectSlug}/gateway/rpc`}
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

async function AsyncAiAnalytics(props: {
  from: Date;
  to: Date;
  interval: "day" | "week";
  projectId: string;
  teamId: string;
  authToken: string;
  teamSlug: string;
  projectSlug: string;
}) {
  const stats = await getAiUsage(
    {
      from: props.from,
      period: props.interval,
      projectId: props.projectId,
      teamId: props.teamId,
      to: props.to,
    },
    props.authToken,
  ).catch((error) => {
    console.error(error);
    return [];
  });

  return (
    <AiTokenUsageChartCardUI
      title="AI token volume"
      isPending={false}
      aiUsageStats={stats}
      viewMoreLink={`/team/${props.teamSlug}/${props.projectSlug}/ai/analytics`}
    />
  );
}

async function AsyncX402RequestsChart(props: {
  from: Date;
  to: Date;
  interval: "day" | "week";
  projectId: string;
  teamId: string;
  authToken: string;
  teamSlug: string;
  projectSlug: string;
}) {
  const stats = await getX402Settlements(
    {
      from: props.from,
      period: props.interval,
      projectId: props.projectId,
      teamId: props.teamId,
      to: props.to,
    },
    props.authToken,
  ).catch((error) => {
    console.error(error);
    return [];
  });

  const isAllEmpty = stats.every((stat) => stat.totalRequests === 0);

  return (
    <X402RequestsChartCardUI
      stats={
        isAllEmpty
          ? []
          : stats.map((stat) => ({
              requests: stat.totalRequests,
              time: stat.date,
            }))
      }
      isPending={false}
      teamSlug={props.teamSlug}
      projectSlug={props.projectSlug}
    />
  );
}
