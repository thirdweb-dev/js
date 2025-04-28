import { ResponsiveSearchParamsProvider } from "responsive-rsc";
import { TransactionAnalyticsFilter } from "./filter";
import { TransactionsChartCard } from "./tx-chart/tx-chart";
import { TransactionsTable } from "./tx-table/tx-table";

export function TransactionsAnalyticsPageContent(props: {
  searchParams: {
    from?: string | undefined | string[];
    to?: string | undefined | string[];
    interval?: string | undefined | string[];
  };
  teamId: string;
  clientId: string;
  project_slug: string;
  team_slug: string;
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
            teamId={props.teamId}
            clientId={props.clientId}
            project_slug={props.project_slug}
            team_slug={props.team_slug}
          />
          <TransactionsTable teamId={props.teamId} clientId={props.clientId} />
        </div>
      </div>
    </ResponsiveSearchParamsProvider>
  );
}
