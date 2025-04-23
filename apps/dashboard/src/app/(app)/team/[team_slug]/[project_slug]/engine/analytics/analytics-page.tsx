import type { Project } from "@/api/projects";
import { ResponsiveSearchParamsProvider } from "responsive-rsc";
import type { Wallet } from "../server-wallets/wallet-table/types";
import { TransactionAnalyticsFilter } from "./filter";
import { SendTestTransaction } from "./send-test-tx.client";
import { TransactionsChartCard } from "./tx-chart/tx-chart";
import { TransactionsTable } from "./tx-table/tx-table";

export function TransactionsAnalyticsPageContent(props: {
  searchParams: {
    from?: string | undefined | string[];
    to?: string | undefined | string[];
    interval?: string | undefined | string[];
  };
  project: Project;
  wallets?: Wallet[];
  expandTestTx?: boolean;
}) {
  return (
    <ResponsiveSearchParamsProvider value={props.searchParams}>
      <div className="flex grow flex-col">
        <div className="flex justify-end">
          <TransactionAnalyticsFilter />
        </div>
        <div className="h-6" />
        <div className="flex grow flex-col gap-6">
          <TransactionsChartCard
            searchParams={props.searchParams}
            project={props.project}
            wallets={props.wallets ?? []}
          />
          <SendTestTransaction
            wallets={props.wallets}
            project={props.project}
            expanded={props.expandTestTx}
          />
          <TransactionsTable project={props.project} wallets={props.wallets} />
        </div>
      </div>
    </ResponsiveSearchParamsProvider>
  );
}
