import { EmptyStateCard } from "app/(app)/team/components/Analytics/EmptyStateCard";
import { ResponsiveSuspense } from "responsive-rsc";
import type { ThirdwebClient } from "thirdweb";
import {
  getInAppWalletUsage,
  getUniversalBridgeUsage,
  getX402Settlements,
} from "@/api/analytics";
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
      searchParamsUsed={["from", "to", "interval"]}
    >
      <AsyncAppHighlightsCard
        authToken={props.authToken}
        client={props.client}
        interval={props.interval}
        params={props.params}
        project={props.project}
        range={props.range}
      />
    </ResponsiveSuspense>
  );
}

async function AsyncAppHighlightsCard(props: {
  project: Project;
  range: Range;
  interval: "day" | "week";
  client: ThirdwebClient;
  params: PageParams;
  authToken: string;
}) {
  const [
    aggregatedUserStats,
    walletUserStatsTimeSeries,
    universalBridgeUsage,
    x402Settlements,
  ] = await Promise.allSettled([
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
    getX402Settlements(
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
        x402Settlements={
          x402Settlements.status === "fulfilled" ? x402Settlements.value : []
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
