import { ResponsiveSuspense } from "responsive-rsc";
import { getInAppWalletUsage } from "@/api/analytics";
import {
  AutoMergeBarChart,
  type StatData,
} from "@/components/blocks/charts/automerge-barchart";

type UserWalletConnectionsChartProps = {
  teamId: string;
  projectId: string;
  authToken: string;
  from: Date;
  to: Date;
  interval: "day" | "week";
};

export function UserWalletConnectionsChart(
  props: UserWalletConnectionsChartProps,
) {
  return (
    <ResponsiveSuspense
      searchParamsUsed={["from", "to", "interval"]}
      fallback={
        <UserWalletConnectionsChartUI {...props} isPending={true} stats={[]} />
      }
    >
      <AsyncUserWalletConnectionsChart {...props} />
    </ResponsiveSuspense>
  );
}

async function AsyncUserWalletConnectionsChart(
  props: UserWalletConnectionsChartProps,
) {
  const stats = await getInAppWalletUsage(
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
    <UserWalletConnectionsChartUI
      {...props}
      isPending={false}
      stats={stats.map((stat) => ({
        date: stat.date,
        count: stat.uniqueWalletsConnected,
        label: stat.authenticationMethod,
      }))}
    />
  );
}

function UserWalletConnectionsChartUI({
  stats,
  isPending,
}: {
  stats: StatData[];
  isPending: boolean;
}) {
  return (
    <AutoMergeBarChart
      viewMoreLink={undefined}
      title="User wallet connections"
      description="Total number of unique user wallets connected"
      stats={stats || []}
      isPending={isPending}
      exportButton={{
        fileName: "user-wallet-connections",
      }}
      maxLabelsToShow={5}
      emptyChartState={undefined}
    />
  );
}
