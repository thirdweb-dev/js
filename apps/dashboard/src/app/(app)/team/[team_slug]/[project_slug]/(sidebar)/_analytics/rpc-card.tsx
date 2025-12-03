import { ResponsiveSuspense } from "responsive-rsc";
import { getRpcUsageByType } from "@/api/analytics";
import { RPCRequestsChartUI } from "../gateway/rpc/components/RequestsGraph";

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

export function RPCRequestsChartCard(props: {
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
        <RPCRequestsChartUI
          isPending={true}
          data={[]}
          viewMoreLink={`/team/${props.teamSlug}/${props.projectSlug}/gateway/rpc`}
        />
      }
      searchParamsUsed={["from", "to", "interval"]}
    >
      <AsyncRPCRequestsChartCard
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
