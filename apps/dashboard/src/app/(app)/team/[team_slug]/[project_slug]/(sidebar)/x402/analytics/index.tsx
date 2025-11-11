import { ResponsiveSuspense } from "responsive-rsc";
import { getX402Settlements } from "@/api/analytics";
import {
  getLastNDaysRange,
  type Range,
} from "@/components/analytics/date-range-selector";
import type {
  X402SettlementsByPayer,
  X402SettlementsByResource,
} from "@/types/analytics";
import { X402SettlementsByPayerChartCard } from "./X402SettlementsByPayerChartCard";
import { X402SettlementsByResourceChartCard } from "./X402SettlementsByResourceChartCard";

// Payments by Resource Chart
type X402SettlementsByResourceChartProps = {
  interval: "day" | "week";
  range: Range;
  stats: X402SettlementsByResource[];
  isPending: boolean;
  metric?: "payments" | "volume";
};

function X402SettlementsByResourceChartUI({
  stats,
  isPending,
  metric = "payments",
}: X402SettlementsByResourceChartProps) {
  return (
    <X402SettlementsByResourceChartCard
      rawData={stats}
      isPending={isPending}
      metric={metric}
    />
  );
}

type AsyncX402SettlementsByResourceChartProps = Omit<
  X402SettlementsByResourceChartProps,
  "stats" | "isPending"
> & {
  teamId: string;
  projectId: string;
  authToken: string;
};

async function AsyncX402SettlementsByResourceChart(
  props: AsyncX402SettlementsByResourceChartProps,
) {
  const range = props.range ?? getLastNDaysRange("last-30");

  const stats = await getX402Settlements(
    {
      from: range.from,
      period: props.interval,
      projectId: props.projectId,
      teamId: props.teamId,
      to: range.to,
      groupBy: "resource",
    },
    props.authToken,
  ).catch((error) => {
    console.error(error);
    return [];
  });

  return (
    <X402SettlementsByResourceChartUI
      {...props}
      isPending={false}
      range={range}
      stats={stats as X402SettlementsByResource[]}
    />
  );
}

export function X402SettlementsByResourceChart(
  props: AsyncX402SettlementsByResourceChartProps,
) {
  return (
    <ResponsiveSuspense
      fallback={
        <X402SettlementsByResourceChartUI
          {...props}
          isPending={true}
          stats={[]}
        />
      }
      searchParamsUsed={["from", "to", "interval", "metric"]}
    >
      <AsyncX402SettlementsByResourceChart {...props} />
    </ResponsiveSuspense>
  );
}

// Payments by Payer Chart
type X402SettlementsByPayerChartProps = {
  interval: "day" | "week";
  range: Range;
  stats: X402SettlementsByPayer[];
  isPending: boolean;
  metric?: "payments" | "volume";
};

function X402SettlementsByPayerChartUI({
  stats,
  isPending,
  metric = "payments",
}: X402SettlementsByPayerChartProps) {
  return (
    <X402SettlementsByPayerChartCard
      rawData={stats}
      isPending={isPending}
      metric={metric}
    />
  );
}

type AsyncX402SettlementsByPayerChartProps = Omit<
  X402SettlementsByPayerChartProps,
  "stats" | "isPending"
> & {
  teamId: string;
  projectId: string;
  authToken: string;
};

async function AsyncX402SettlementsByPayerChart(
  props: AsyncX402SettlementsByPayerChartProps,
) {
  const range = props.range ?? getLastNDaysRange("last-30");

  const stats = await getX402Settlements(
    {
      from: range.from,
      period: props.interval,
      projectId: props.projectId,
      teamId: props.teamId,
      to: range.to,
      groupBy: "payer",
    },
    props.authToken,
  ).catch((error) => {
    console.error(error);
    return [];
  });

  return (
    <X402SettlementsByPayerChartUI
      {...props}
      isPending={false}
      range={range}
      stats={stats as X402SettlementsByPayer[]}
    />
  );
}

export function X402SettlementsByPayerChart(
  props: AsyncX402SettlementsByPayerChartProps,
) {
  return (
    <ResponsiveSuspense
      fallback={
        <X402SettlementsByPayerChartUI {...props} isPending={true} stats={[]} />
      }
      searchParamsUsed={["from", "to", "interval", "metric"]}
    >
      <AsyncX402SettlementsByPayerChart {...props} />
    </ResponsiveSuspense>
  );
}
