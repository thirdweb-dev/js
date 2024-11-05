"use client";
import {
  getInAppWalletUsage,
  useUserOpUsageAggregate,
  useWalletUsageAggregate,
  useWalletUsagePeriod,
} from "@3rdweb-sdk/react/hooks/useApi";
import { useQuery } from "@tanstack/react-query";
import {
  type Range,
  getLastNDaysRange,
} from "components/analytics/date-range-selector";
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

  const inAppAggregateQuery = useQuery({
    queryKey: ["in-app-usage-aggregate", props.clientId],
    queryFn: async () => {
      const [allTimeStats, monthlyStats] = await Promise.all([
        getInAppWalletUsage({
          clientId: props.clientId,
          from: new Date(2022, 0, 1),
          to: new Date(),
          period: "all",
        }),
        getInAppWalletUsage({
          clientId: props.clientId,
          from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          to: new Date(),
          period: "month",
        }),
      ]);
      return { allTimeStats, monthlyStats };
    },
  });

  return (
    <div>
      <ConnectAnalyticsDashboardUI
        walletUsage={walletUsageQuery.data || []}
        aggregateWalletUsage={walletUsageAggregateQuery.data || []}
        aggregateUserOpUsageQuery={userOpAggregateQuery.data}
        connectLayoutSlug={props.connectLayoutSlug}
        inAppAggregateQuery={inAppAggregateQuery.data}
        isPending={
          walletUsageQuery.isPending || walletUsageAggregateQuery.isPending
        }
        range={range}
        setRange={setRange}
        intervalType={intervalType}
        setIntervalType={setIntervalType}
      />
    </div>
  );
}
