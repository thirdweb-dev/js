import { ResponsiveSuspense } from "responsive-rsc";
import { getTransactionsChart } from "../../lib/analytics";
import { getTxAnalyticsFiltersFromSearchParams } from "../../lib/utils";
import type { Wallet } from "../../server-wallets/wallet-table/types";
import { TransactionsChartCardUI } from "./tx-chart-ui";

async function AsyncTransactionsChartCard(props: {
  from: string;
  to: string;
  interval: "day" | "week";
  teamId: string;
  clientId: string;
  project_slug: string;
  team_slug: string;
  wallets: Wallet[];
}) {
  const data = await getTransactionsChart({
    teamId: props.teamId,
    clientId: props.clientId,
    from: props.from,
    to: props.to,
    interval: props.interval,
  });

  return (
    <TransactionsChartCardUI
      isPending={false}
      userOpStats={data}
      project_slug={props.project_slug}
      team_slug={props.team_slug}
      wallets={props.wallets}
    />
  );
}

export function TransactionsChartCard(props: {
  searchParams: {
    from?: string | undefined | string[];
    to?: string | undefined | string[];
    interval?: string | undefined | string[];
  };
  teamId: string;
  clientId: string;
  project_slug: string;
  team_slug: string;
  wallets: Wallet[];
}) {
  const { range, interval } = getTxAnalyticsFiltersFromSearchParams(
    props.searchParams,
  );

  return (
    <ResponsiveSuspense
      // TODO - change this if this component does not end up using these params
      searchParamsUsed={["from", "to", "interval"]}
      fallback={
        <TransactionsChartCardUI
          isPending={true}
          userOpStats={[]}
          project_slug={props.project_slug}
          team_slug={props.team_slug}
          wallets={[]}
        />
      }
    >
      <AsyncTransactionsChartCard
        from={range.from.toISOString()}
        to={range.to.toISOString()}
        interval={interval}
        teamId={props.teamId}
        clientId={props.clientId}
        project_slug={props.project_slug}
        team_slug={props.team_slug}
        wallets={props.wallets}
      />
    </ResponsiveSuspense>
  );
}
