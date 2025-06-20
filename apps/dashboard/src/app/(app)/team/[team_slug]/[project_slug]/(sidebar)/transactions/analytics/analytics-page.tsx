import type { Project } from "@/api/projects";
import { ResponsiveSearchParamsProvider } from "responsive-rsc";
import type { ThirdwebClient } from "thirdweb";
import type { Wallet } from "../server-wallets/wallet-table/types";
import { TransactionAnalyticsFilter } from "./filter";
import { TransactionsChartCard } from "./tx-chart/tx-chart";
import { TransactionsTable } from "./tx-table/tx-table";

export function TransactionsAnalyticsPageContent(props: {
  searchParams: {
    from?: string | undefined | string[];
    to?: string | undefined | string[];
    interval?: string | undefined | string[];
  };
  project: Project;
  showAnalytics: boolean;
  wallets?: Wallet[];
  teamSlug: string;
  client: ThirdwebClient;
}) {
  return (
    <ResponsiveSearchParamsProvider value={props.searchParams}>
      <div className="flex grow flex-col gap-6">
        {props.showAnalytics && (
          <>
            <div className="flex justify-end">
              <TransactionAnalyticsFilter />
            </div>
            <TransactionsChartCard
              searchParams={props.searchParams}
              project={props.project}
              wallets={props.wallets ?? []}
              teamSlug={props.teamSlug}
            />
          </>
        )}
        <TransactionsTable
          project={props.project}
          wallets={props.wallets}
          teamSlug={props.teamSlug}
          client={props.client}
        />
      </div>
    </ResponsiveSearchParamsProvider>
  );
}
