"use client";
import {
  useWalletUsageAggregate,
  useWalletUsagePeriod,
} from "@3rdweb-sdk/react/hooks/useApi";
import { useMemo } from "react";
import { ConnectAnalyticsDashboardUI } from "./ConnectAnalyticsDashboardUI";

export function ConnectAnalyticsDashboard(props: {
  clientId: string;
}) {
  const allTimeFrom = useMemo(
    () => new Date(Date.now() - 135 * 24 * 60 * 60 * 1000),
    [],
  );
  const from = useMemo(
    () => new Date(Date.now() - 135 * 24 * 60 * 60 * 1000),
    [],
  );
  const to = useMemo(() => new Date(), []);
  const walletUsageQuery = useWalletUsagePeriod({
    clientId: props.clientId,
    from,
    to,
    period: "day",
  });
  const walletUsageAggregateQuery = useWalletUsageAggregate({
    clientId: props.clientId,
    from: allTimeFrom,
    to,
  });

  return (
    <ConnectAnalyticsDashboardUI
      walletUsage={walletUsageQuery.data || []}
      aggregateWalletUsage={walletUsageAggregateQuery.data || []}
      isLoading={
        walletUsageQuery.isLoading || walletUsageAggregateQuery.isLoading
      }
    />
  );
}
