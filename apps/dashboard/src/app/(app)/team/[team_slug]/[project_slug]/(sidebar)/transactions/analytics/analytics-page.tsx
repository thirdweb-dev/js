"use client";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@workspace/ui/components/spinner";
import { useMemo } from "react";
import type { ThirdwebClient } from "thirdweb";
import type { Project } from "@/api/project/projects";
import { getLastNDaysRange } from "@/components/analytics/date-range-selector";
import { normalizeTimeISOString } from "@/lib/time";
import { UnifiedTransactionsTable } from "../components/transactions-table.client";
import { getTransactionAnalyticsSummary } from "../lib/analytics-summary.client";
import type { Wallet } from "../server-wallets/wallet-table/types";
import type { SolanaWallet } from "../solana-wallets/wallet-table/types";
import { EngineChecklist } from "./ftux.client";
import { TransactionsAnalytics } from "./tx-chart/tx-chart";

export function TransactionsAnalyticsPageContent(props: {
  project: Project;
  showAnalytics: boolean;
  wallets: Wallet[];
  teamSlug: string;
  client: ThirdwebClient;
  authToken: string;
  teamId: string;
  isManagedVault: boolean;
  testTxWithWallet: string | undefined;
  testSolanaTxWithWallet: string | undefined;
  solanaWallets: SolanaWallet[];
}) {
  const defaultRange = useMemo(() => {
    const range = getLastNDaysRange("last-30");
    return {
      from: normalizeTimeISOString(range.from),
      to: normalizeTimeISOString(range.to),
    };
  }, []);

  const engineTxSummaryQuery = useQuery({
    queryKey: [
      "engine-tx-analytics-summary",
      props.teamId,
      props.project.publishableKey,
      props.authToken,
      defaultRange.from,
      defaultRange.to,
    ],
    queryFn: async () => {
      const data = await getTransactionAnalyticsSummary({
        clientId: props.project.publishableKey,
        teamId: props.teamId,
        authToken: props.authToken,
        startDate: defaultRange.from,
        endDate: defaultRange.to,
      });
      return data;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  if (engineTxSummaryQuery.isPending) {
    return (
      <div className="flex h-[642px] grow items-center justify-center bg-card rounded-xl border">
        <Spinner className="size-10" />
      </div>
    );
  }

  const hasTransactions = engineTxSummaryQuery.data
    ? engineTxSummaryQuery.data.totalCount > 0
    : false;

  return (
    <div className="flex grow flex-col gap-10">
      <EngineChecklist
        isManagedVault={props.isManagedVault}
        client={props.client}
        hasTransactions={hasTransactions}
        project={props.project}
        teamSlug={props.teamSlug}
        testTxWithWallet={props.testTxWithWallet}
        testSolanaTxWithWallet={props.testSolanaTxWithWallet}
        wallets={props.wallets}
        solanaWallets={props.solanaWallets}
      />

      {props.showAnalytics && hasTransactions && (
        <TransactionsAnalytics
          project={props.project}
          authToken={props.authToken}
          teamSlug={props.teamSlug}
          wallets={props.wallets ?? []}
        />
      )}

      <UnifiedTransactionsTable
        client={props.client}
        project={props.project}
        teamSlug={props.teamSlug}
      />
    </div>
  );
}
