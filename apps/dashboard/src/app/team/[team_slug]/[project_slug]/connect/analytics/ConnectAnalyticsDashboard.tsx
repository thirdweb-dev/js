"use client";
import {
  useUserOpUsageAggregate,
  useWalletUsageAggregate,
  useWalletUsagePeriod,
} from "@3rdweb-sdk/react/hooks/useApi";
import {
  DateRangeSelector,
  type Range,
  getLastNDaysRange,
} from "components/analytics/date-range-selector";
import { IntervalSelector } from "components/analytics/interval-selector";
import { differenceInDays } from "date-fns";
import { useState } from "react";
import { ConnectAnalyticsDashboardUI } from "./ConnectAnalyticsDashboardUI";

export function ConnectAnalyticsDashboard(props: {
  clientId: string;
  connectLayoutSlug: string;
}) {
  const [range, setRange] = useState<Range>(() =>
    getLastNDaysRange("last-120"),
  );

  // use date-fns to calculate the number of days in the range
  const daysInRange = differenceInDays(range.to, range.from);
  const [intervalType, setIntervalType] = useState<"day" | "week">(
    daysInRange > 30 ? "week" : "day",
  );

  const walletUsageQuery = useWalletUsagePeriod({
    clientId: props.clientId,
    from: range.from,
    to: range.to,
    period: intervalType,
  });

  const walletUsageAggregateQuery = useWalletUsageAggregate({
    clientId: props.clientId,
    from: range.from,
    to: range.to,
  });

  const userOpAggregateQuery = useUserOpUsageAggregate({
    clientId: props.clientId,
  });

  return (
    <div>
      <div className="flex gap-3">
        <DateRangeSelector
          range={range}
          setRange={(newRange) => {
            setRange(newRange);
            const days = differenceInDays(newRange.to, newRange.from);
            setIntervalType(days > 30 ? "week" : "day");
          }}
        />
        <IntervalSelector
          intervalType={intervalType}
          setIntervalType={setIntervalType}
        />
      </div>
      <div className="h-4" />
      <ConnectAnalyticsDashboardUI
        walletUsage={walletUsageQuery.data || []}
        aggregateWalletUsage={walletUsageAggregateQuery.data || []}
        aggregateUserOpUsageQuery={userOpAggregateQuery.data}
        connectLayoutSlug={props.connectLayoutSlug}
        isPending={
          walletUsageQuery.isPending || walletUsageAggregateQuery.isPending
        }
      />
    </div>
  );
}
