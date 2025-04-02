import { getInAppWalletUsage } from "@/api/analytics";
import { StatCard } from "components/analytics/stat";
import { subDays } from "date-fns";
import { ActivityIcon, UserIcon } from "lucide-react";
import { Suspense } from "react";
import type { InAppWalletStats } from "types/analytics";

function InAppWalletsSummaryInner(props: {
  allTimeStats: InAppWalletStats[] | undefined;
  monthlyStats: InAppWalletStats[] | undefined;
  isPending: boolean;
}) {
  const allTimeStats = props.allTimeStats?.reduce(
    (acc, curr) => {
      acc.uniqueWalletsConnected += curr.uniqueWalletsConnected;
      return acc;
    },
    {
      uniqueWalletsConnected: 0,
    },
  );

  const monthlyStats = props.monthlyStats?.reduce(
    (acc, curr) => {
      acc.uniqueWalletsConnected += curr.uniqueWalletsConnected;
      return acc;
    },
    {
      uniqueWalletsConnected: 0,
    },
  );

  return (
    <div className="grid grid-cols-2 gap-4">
      <StatCard
        label="Total Users"
        value={allTimeStats?.uniqueWalletsConnected || 0}
        icon={ActivityIcon}
        isPending={props.isPending}
      />
      <StatCard
        label="Monthly Active Users"
        value={monthlyStats?.uniqueWalletsConnected || 0}
        icon={UserIcon}
        isPending={props.isPending}
      />
    </div>
  );
}

async function AsyncInAppWalletsSummary(props: {
  teamId: string;
  projectId: string;
}) {
  const { teamId, projectId } = props;
  const allTimeStatsPromise = getInAppWalletUsage({
    teamId,
    projectId,
    from: new Date(2022, 0, 1),
    to: new Date(),
    period: "all",
  });

  const monthlyStatsPromise = getInAppWalletUsage({
    teamId,
    projectId,
    from: subDays(new Date(), 30),
    to: new Date(),
    period: "month",
  });

  const [allTimeStats, monthlyStats] = await Promise.all([
    allTimeStatsPromise,
    monthlyStatsPromise,
  ]).catch(() => [null, null]);

  return (
    <InAppWalletsSummaryInner
      allTimeStats={allTimeStats || undefined}
      monthlyStats={monthlyStats || undefined}
      isPending={false}
    />
  );
}

export function InAppWalletsSummary(props: {
  teamId: string;
  projectId: string;
}) {
  return (
    <Suspense
      fallback={
        <InAppWalletsSummaryInner
          allTimeStats={undefined}
          monthlyStats={undefined}
          isPending={true}
        />
      }
    >
      <AsyncInAppWalletsSummary
        teamId={props.teamId}
        projectId={props.projectId}
      />
    </Suspense>
  );
}
