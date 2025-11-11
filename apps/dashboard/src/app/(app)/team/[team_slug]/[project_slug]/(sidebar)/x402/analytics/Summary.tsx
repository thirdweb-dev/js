import { CreditCardIcon, DollarSignIcon, UsersIcon } from "lucide-react";
import { Suspense } from "react";
import { getX402Settlements } from "@/api/analytics";
import type { Range } from "@/components/analytics/date-range-selector";
import { StatCard } from "@/components/analytics/stat";
import type {
  X402SettlementsByPayer,
  X402SettlementsOverall,
} from "@/types/analytics";

function X402SummaryInner(props: {
  totalPayments: number | undefined;
  totalBuyers: number | undefined;
  totalVolume: number | undefined;
  isPending: boolean;
}) {
  const formatUSD = (value: number) => {
    return `$${value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    })}`;
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      <StatCard
        icon={CreditCardIcon}
        isPending={props.isPending}
        label="Total Payments"
        value={props.totalPayments || 0}
      />
      <StatCard
        icon={UsersIcon}
        isPending={props.isPending}
        label="Total Buyers"
        value={props.totalBuyers || 0}
      />
      <StatCard
        formatter={formatUSD}
        icon={DollarSignIcon}
        isPending={props.isPending}
        label="Total Volume"
        value={props.totalVolume || 0}
      />
    </div>
  );
}

async function AsyncX402Summary(props: {
  teamId: string;
  projectId: string;
  authToken: string;
  range: Range;
}) {
  const { teamId, projectId, authToken, range } = props;

  const [overallStats, payerStats] = await Promise.all([
    getX402Settlements(
      {
        from: range.from,
        period: "all",
        projectId,
        teamId,
        to: range.to,
        groupBy: "overall",
      },
      authToken,
    ).catch(() => []),
    getX402Settlements(
      {
        from: range.from,
        period: "all",
        projectId,
        teamId,
        to: range.to,
        groupBy: "payer",
      },
      authToken,
    ).catch(() => []),
  ]);

  const totalPayments = (overallStats as X402SettlementsOverall[]).reduce(
    (acc, curr) => acc + curr.totalRequests,
    0,
  );

  const totalVolume = (overallStats as X402SettlementsOverall[]).reduce(
    (acc, curr) => acc + curr.totalValueUSD,
    0,
  );

  // Count unique payers
  const uniquePayers = new Set(
    (payerStats as X402SettlementsByPayer[]).map((stat) => stat.payer),
  );
  const totalBuyers = uniquePayers.size;

  return (
    <X402SummaryInner
      totalBuyers={totalBuyers}
      totalPayments={totalPayments}
      totalVolume={totalVolume}
      isPending={false}
    />
  );
}

export function X402Summary(props: {
  teamId: string;
  projectId: string;
  authToken: string;
  range: Range;
}) {
  return (
    <Suspense
      fallback={
        <X402SummaryInner
          totalBuyers={undefined}
          totalPayments={undefined}
          totalVolume={undefined}
          isPending={true}
        />
      }
    >
      <AsyncX402Summary
        authToken={props.authToken}
        projectId={props.projectId}
        range={props.range}
        teamId={props.teamId}
      />
    </Suspense>
  );
}
