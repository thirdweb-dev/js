import { ResponsiveSuspense } from "responsive-rsc";
import { getAiUsage } from "@/api/analytics";
import { EmptyChartStateGetStartedCTA } from "@/components/analytics/empty-chart-state";
import { AiTokenUsageChartCardUI } from "../ai/analytics/chart/AiTokenUsageChartCard";

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
      emptyChartState={
        <EmptyChartStateGetStartedCTA
          link={{
            label: "View more details",
            href: `/team/${props.teamSlug}/${props.projectSlug}/ai/analytics`,
          }}
          title="No data available"
          description="No AI usage found in selected time period"
        />
      }
    />
  );
}

export function AIAnalyticsChartCard(props: {
  from: Date;
  to: Date;
  interval: "day" | "week";
  projectId: string;
  teamId: string;
  authToken: string;
  teamSlug: string;
  projectSlug: string;
}) {
  return (
    <ResponsiveSuspense
      fallback={
        <AiTokenUsageChartCardUI
          isPending={true}
          title="AI token volume"
          viewMoreLink={`/team/${props.teamSlug}/${props.projectSlug}/ai/analytics`}
          aiUsageStats={[]}
        />
      }
      searchParamsUsed={["from", "to", "interval"]}
    >
      <AsyncAiAnalytics
        teamSlug={props.teamSlug}
        projectSlug={props.projectSlug}
        from={props.from}
        to={props.to}
        interval={props.interval}
        projectId={props.projectId}
        teamId={props.teamId}
        authToken={props.authToken}
      />
    </ResponsiveSuspense>
  );
}
