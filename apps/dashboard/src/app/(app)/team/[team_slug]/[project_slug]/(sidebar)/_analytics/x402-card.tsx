import { ResponsiveSuspense } from "responsive-rsc";
import { getX402Settlements } from "@/api/analytics";
import { EmptyChartStateGetStartedCTA } from "@/components/analytics/empty-chart-state";
import { X402RequestsChartCardUI } from "./x402-requests-chart";

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
      emptyChartState={
        <EmptyChartStateGetStartedCTA
          link={{
            label: "View Configuration",
            href: `/team/${props.teamSlug}/${props.projectSlug}/x402/configuration`,
          }}
          title="No data available"
          description="No X402 requests found in selected time period"
        />
      }
    />
  );
}

export function X402RequestsChartCard(props: {
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
      searchParamsUsed={["from", "to", "interval"]}
      fallback={
        <X402RequestsChartCardUI
          stats={[]}
          isPending={true}
          teamSlug={props.teamSlug}
          projectSlug={props.projectSlug}
        />
      }
    >
      <AsyncX402RequestsChart
        from={props.from}
        teamSlug={props.teamSlug}
        projectSlug={props.projectSlug}
        to={props.to}
        interval={props.interval}
        projectId={props.projectId}
        teamId={props.teamId}
        authToken={props.authToken}
      />
    </ResponsiveSuspense>
  );
}
