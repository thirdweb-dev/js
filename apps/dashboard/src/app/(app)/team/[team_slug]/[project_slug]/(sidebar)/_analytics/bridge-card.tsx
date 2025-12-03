import { ResponsiveSuspense } from "responsive-rsc";
import { getUniversalBridgeUsage } from "@/api/analytics";
import { LoadingChartState } from "@/components/analytics/empty-chart-state";
import { TotalValueChartHeader } from "@/components/blocks/charts/chart-header";
import type { UniversalBridgeStats } from "@/types/analytics";
import { TotalVolumePieChart } from "../payments/components/TotalVolumePieChart";

async function AsyncBridgeCard(props: {
  from: Date;
  to: Date;
  interval: "day" | "week";
  projectId: string;
  teamId: string;
  authToken: string;
  teamSlug: string;
  projectSlug: string;
}) {
  const data = await getUniversalBridgeUsage(
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
    <BridgeChartCardUI
      data={data}
      teamSlug={props.teamSlug}
      projectSlug={props.projectSlug}
    />
  );
}

export function BridgeChartCard(props: {
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
      fallback={<LoadingChartState className="min-h-[40px] h-full border" />}
      searchParamsUsed={["from", "to", "interval"]}
    >
      <AsyncBridgeCard {...props} />
    </ResponsiveSuspense>
  );
}

function BridgeChartCardUI(props: {
  data: UniversalBridgeStats[];
  teamSlug: string;
  projectSlug: string;
}) {
  const total =
    props.data.reduce((acc, curr) => acc + curr.amountUsdCents, 0) / 100;

  return (
    <div className="flex flex-col bg-card border rounded-lg">
      <TotalValueChartHeader
        title="Bridge Volume"
        total={total}
        isUsd={true}
        isPending={false}
        viewMoreLink={`/team/${props.teamSlug}/${props.projectSlug}/bridge`}
      />
      <div className="p-6 grow flex items-center justify-center">
        <TotalVolumePieChart data={props.data} hideTotal={true} />
      </div>
    </div>
  );
}
