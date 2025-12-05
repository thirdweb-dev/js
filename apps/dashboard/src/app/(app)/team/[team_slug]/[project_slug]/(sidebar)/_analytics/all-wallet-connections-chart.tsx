import { ResponsiveSuspense } from "responsive-rsc";
import { getEOAAndInAppWalletConnections } from "@/api/analytics";
import { EmptyChartStateGetStartedCTA } from "@/components/analytics/empty-chart-state";
import {
  AutoMergeBarChart,
  type StatData,
} from "@/components/blocks/charts/automerge-barchart";

type AllWalletConnectionsChartProps = {
  teamId: string;
  projectId: string;
  authToken: string;
  from: Date;
  to: Date;
  interval: "day" | "week";
  teamSlug: string;
  projectSlug: string;
};

export function AllWalletConnectionsChart(
  props: AllWalletConnectionsChartProps,
) {
  return (
    <ResponsiveSuspense
      searchParamsUsed={["from", "to", "interval"]}
      fallback={
        <AllWalletConnectionsChartUI {...props} isPending={true} stats={[]} />
      }
    >
      <AsyncAllWalletConnectionsChart {...props} />
    </ResponsiveSuspense>
  );
}

async function AsyncAllWalletConnectionsChart(
  props: AllWalletConnectionsChartProps,
) {
  const stats = await getEOAAndInAppWalletConnections(
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
    <AllWalletConnectionsChartUI
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

function AllWalletConnectionsChartUI(props: {
  stats: StatData[];
  teamSlug: string;
  projectSlug: string;
  isPending: boolean;
}) {
  return (
    <AutoMergeBarChart
      title="Wallet connections"
      description={undefined}
      stats={props.stats || []}
      isPending={props.isPending}
      exportButton={undefined}
      maxLabelsToShow={5}
      emptyChartState={
        <EmptyChartStateGetStartedCTA
          link={{
            label: "View Configuration",
            href: `/team/${props.teamSlug}/${props.projectSlug}/wallets/user-wallets/configure`,
          }}
          title="No data available"
          description="No wallet connections found in selected time period"
        />
      }
      viewMoreLink={`/team/${props.teamSlug}/${props.projectSlug}/wallets/user-wallets`}
    />
  );
}
