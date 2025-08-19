import { ActivityIcon, UserIcon } from "lucide-react";
import { Suspense } from "react";
import { getInAppWalletUsage } from "@/api/analytics";
import type { Range } from "@/components/analytics/date-range-selector";
import { StatCard } from "@/components/analytics/stat";
import type { InAppWalletStats } from "@/types/analytics";

function InAppWalletsSummaryInner(props: {
  stats: InAppWalletStats[] | undefined;
  isPending: boolean;
}) {
  const activeUsers = props.stats?.reduce((acc, curr) => {
    return acc + curr.uniqueWalletsConnected;
  }, 0);

  const newUsers = props.stats?.reduce((acc, curr) => {
    return acc + curr.newUsers;
  }, 0);

  return (
    <div className="grid grid-cols-2 gap-4">
      <StatCard
        icon={ActivityIcon}
        isPending={props.isPending}
        label="Active Users"
        value={activeUsers || 0}
      />
      <StatCard
        icon={UserIcon}
        isPending={props.isPending}
        label="New Users"
        value={newUsers || 0}
      />
    </div>
  );
}

async function AsyncInAppWalletsSummary(props: {
  teamId: string;
  projectId: string;
  authToken: string;
  range: Range;
}) {
  const { teamId, projectId, authToken, range } = props;
  const aggregatedStatsPromise = getInAppWalletUsage(
    {
      from: range.from,
      period: "all",
      projectId,
      teamId,
      to: range.to,
    },
    authToken,
  );

  const aggregatedStats = await aggregatedStatsPromise.catch(() => null);

  return (
    <InAppWalletsSummaryInner
      stats={aggregatedStats || undefined}
      isPending={false}
    />
  );
}

export function InAppWalletsSummary(props: {
  teamId: string;
  projectId: string;
  authToken: string;
  range: Range;
}) {
  return (
    <Suspense
      fallback={<InAppWalletsSummaryInner stats={undefined} isPending={true} />}
    >
      <AsyncInAppWalletsSummary
        projectId={props.projectId}
        teamId={props.teamId}
        authToken={props.authToken}
        range={props.range}
      />
    </Suspense>
  );
}
