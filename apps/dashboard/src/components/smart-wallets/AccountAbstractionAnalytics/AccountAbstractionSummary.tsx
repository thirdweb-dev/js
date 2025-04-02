import { getAggregateUserOpUsage } from "@/api/analytics";
import { StatCard } from "components/analytics/stat";
import { ActivityIcon, CoinsIcon } from "lucide-react";
import { Suspense } from "react";
import type { UserOpStats } from "types/analytics";

function AccountAbstractionSummaryInner(props: {
  aggregateUserOpUsageQuery: UserOpStats | undefined;
  isPending: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <StatCard
        label="Mainnet Sponsored Transactions"
        value={props.aggregateUserOpUsageQuery?.successful || 0}
        icon={ActivityIcon}
        isPending={props.isPending}
      />
      <StatCard
        label="Mainnet Gas Sponsored"
        value={props.aggregateUserOpUsageQuery?.sponsoredUsd || 0}
        formatter={(value: number) =>
          new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(value)
        }
        icon={CoinsIcon}
        isPending={props.isPending}
      />
    </div>
  );
}

async function AsyncAccountAbstractionSummary(props: {
  teamId: string;
  projectId: string;
}) {
  const aggregateUserOpStats = await getAggregateUserOpUsage({
    teamId: props.teamId,
    projectId: props.projectId,
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
        teamId={props.teamId}
        projectId={props.projectId}
      />
    </Suspense>
  );
}
