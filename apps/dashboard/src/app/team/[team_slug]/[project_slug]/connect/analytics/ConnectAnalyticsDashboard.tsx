"use client";

import { useWalletStats } from "@3rdweb-sdk/react/hooks/useApi";
import { ConnectAnalyticsDashboardUI } from "./ConnectAnalyticsDashboardUI";

export function ConnectAnalyticsDashboard(props: {
  clientId: string;
}) {
  const statsQuery = useWalletStats(props.clientId);

  return (
    <ConnectAnalyticsDashboardUI
      walletStats={
        statsQuery.data || {
          timeSeries: [],
        }
      }
      isLoading={statsQuery.isLoading}
    />
  );
}
