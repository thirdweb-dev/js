import { EmptyStateCard } from "app/(app)/team/components/Analytics/EmptyStateCard";
import { ResponsiveSuspense } from "responsive-rsc";
import type { ThirdwebClient } from "thirdweb";
import { getInAppWalletUsage, getUniversalBridgeUsage } from "@/api/analytics";
import type { Project } from "@/api/project/projects";
import type { Range } from "@/components/analytics/date-range-selector";
import { LoadingChartState } from "@/components/analytics/empty-chart-state";
import { ProjectHighlightsCard } from "./highlights-card-ui";
import type { PageParams, PageSearchParams } from "./types";

export function ProjectHighlightCard(props: {
  authToken: string;
  client: ThirdwebClient;
  interval: "day" | "week";
  params: PageParams;
  range: Range;
  searchParams: PageSearchParams;
  project: Project;
}) {
  return (
    <ResponsiveSuspense
      fallback={<LoadingChartState className="h-[458px] border" />}
      searchParamsUsed={["from", "to", "interval", "appHighlights"]}
    >
      <AsyncAppHighlightsCard
        authToken={props.authToken}
        client={props.client}
        interval={props.interval}
        params={props.params}
        project={props.project}
        range={props.range}
        selectedChart={
          typeof props.searchParams.appHighlights === "string"
            ? props.searchParams.appHighlights
            : undefined
        }
        selectedChartQueryParam="appHighlights"
      />
    </ResponsiveSuspense>
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
