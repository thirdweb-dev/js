import { ResponsiveSuspense } from "responsive-rsc";
import { getInsightStatusCodeUsage } from "@/api/analytics";
import { RequestsByStatusGraph } from "../gateway/indexer/components/RequestsByStatusGraph";

export function IndexerRequestsChartCard(props: {
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
        <RequestsByStatusGraph
          data={[]}
          isPending={true}
          viewMoreLink={`/team/${props.teamSlug}/${props.projectSlug}/gateway/indexer`}
        />
      }
      searchParamsUsed={["from", "to", "interval"]}
    >
      <AsyncIndexerRequestsChartCard
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
