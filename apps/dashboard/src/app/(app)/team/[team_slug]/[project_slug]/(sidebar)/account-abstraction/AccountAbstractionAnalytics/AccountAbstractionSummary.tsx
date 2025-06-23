import { ActivityIcon, CoinsIcon } from "lucide-react";
import { Suspense } from "react";
import { getAggregateUserOpUsage } from "@/api/analytics";
import { StatCard } from "@/components/analytics/stat";
import type { UserOpStats } from "@/types/analytics";

function AccountAbstractionSummaryInner(props: {
  aggregateUserOpUsageQuery: UserOpStats | undefined;
  isPending: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <StatCard
        icon={ActivityIcon}
        isPending={props.isPending}
        label="Mainnet Sponsored Transactions"
        value={props.aggregateUserOpUsageQuery?.successful || 0}
      />
      <StatCard
        formatter={(value: number) =>
          new Intl.NumberFormat("en-US", {
            currency: "USD",
            style: "currency",
          }).format(value)
        }
        icon={CoinsIcon}
        isPending={props.isPending}
        label="Mainnet Gas Sponsored"
        value={props.aggregateUserOpUsageQuery?.sponsoredUsd || 0}
      />
    </div>
  );
}

async function AsyncAccountAbstractionSummary(props: {
  teamId: string;
  projectId: string;
}) {
  const aggregateUserOpStats = await getAggregateUserOpUsage({
    projectId: props.projectId,
    teamId: props.teamId,
  });

  return (
    <AccountAbstractionSummaryInner
      aggregateUserOpUsageQuery={aggregateUserOpStats}
      isPending={false}
    />
  );
}

export function AccountAbstractionSummary(props: {
  teamId: string;
  projectId: string;
}) {
  return (
    <Suspense
      fallback={
        <AccountAbstractionSummaryInner
          aggregateUserOpUsageQuery={undefined}
          isPending={true}
        />
      }
    >
      <AsyncAccountAbstractionSummary
        projectId={props.projectId}
        teamId={props.teamId}
      />
    </Suspense>
  );
}
