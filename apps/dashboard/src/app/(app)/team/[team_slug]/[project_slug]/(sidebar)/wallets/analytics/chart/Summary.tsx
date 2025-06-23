import { subDays } from "date-fns";
import { ActivityIcon, UserIcon } from "lucide-react";
import { Suspense } from "react";
import { getInAppWalletUsage } from "@/api/analytics";
import { StatCard } from "@/components/analytics/stat";
import type { InAppWalletStats } from "@/types/analytics";

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
        icon={ActivityIcon}
        isPending={props.isPending}
        label="Total Users"
        value={allTimeStats?.uniqueWalletsConnected || 0}
      />
      <StatCard
        icon={UserIcon}
        isPending={props.isPending}
        label="Monthly Active Users"
        value={monthlyStats?.uniqueWalletsConnected || 0}
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
    from: new Date(2022, 0, 1),
    period: "all",
    projectId,
    teamId,
    to: new Date(),
  });

  const monthlyStatsPromise = getInAppWalletUsage({
    from: subDays(new Date(), 30),
    period: "month",
    projectId,
    teamId,
    to: new Date(),
  });

  const [allTimeStats, monthlyStats] = await Promise.all([
    allTimeStatsPromise,
    monthlyStatsPromise,
  ]).catch(() => [null, null]);

  return (
    <InAppWalletsSummaryInner
      allTimeStats={allTimeStats || undefined}
      isPending={false}
      monthlyStats={monthlyStats || undefined}
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
          isPending={true}
          monthlyStats={undefined}
        />
      }
    >
      <AsyncInAppWalletsSummary
        projectId={props.projectId}
        teamId={props.teamId}
      />
    </Suspense>
  );
}
