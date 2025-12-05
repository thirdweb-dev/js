import { ResponsiveSuspense } from "responsive-rsc";
import { getEOAWalletConnections } from "@/api/analytics";
import {
  AutoMergeBarChart,
  type StatData,
} from "@/components/blocks/charts/automerge-barchart";

type EOAConnectionsChartProps = {
  teamId: string;
  projectId: string;
  authToken: string;
  from: Date;
  to: Date;
  interval: "day" | "week";
};

export function EOAConnectionsChart(props: EOAConnectionsChartProps) {
  return (
    <ResponsiveSuspense
      searchParamsUsed={["from", "to", "interval"]}
      fallback={
        <EOAConnectionsChartUI {...props} isPending={true} stats={[]} />
      }
    >
      <AsyncEOAConnectionsChart {...props} />
    </ResponsiveSuspense>
  );
}

async function AsyncEOAConnectionsChart(props: EOAConnectionsChartProps) {
  const stats = await getEOAWalletConnections(
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
    <EOAConnectionsChartUI
      {...props}
      isPending={false}
      stats={stats.map((stat) => ({
        date: stat.date,
        count: stat.uniqueWalletsConnected,
        label: stat.walletName,
      }))}
    />
  );
}

function EOAConnectionsChartUI({
  stats,
  isPending,
}: {
  stats: StatData[];
  isPending: boolean;
}) {
  return (
    <AutoMergeBarChart
      viewMoreLink={undefined}
      title="EOA wallet connections"
      description="Total number of unique EOA wallets connected"
      stats={stats || []}
      isPending={isPending}
      exportButton={{
        fileName: "eoa-connections",
      }}
      maxLabelsToShow={5}
      emptyChartState={undefined}
    />
  );
}
