import type { Project } from "@/api/projects";
import { ResponsiveSuspense } from "responsive-rsc";
import { getTransactionsChart } from "../../lib/analytics";
import { getTxAnalyticsFiltersFromSearchParams } from "../../lib/utils";
import type { Wallet } from "../../server-wallets/wallet-table/types";
import { TransactionsChartCardUI } from "./tx-chart-ui";

async function AsyncTransactionsChartCard(props: {
  from: string;
  to: string;
  interval: "day" | "week";
  project: Project;
  wallets: Wallet[];
  teamSlug: string;
}) {
  const data = await getTransactionsChart({
    clientId: props.project.publishableKey,
    teamId: props.project.teamId,
    from: props.from,
    to: props.to,
    interval: props.interval,
  });

  return (
    <TransactionsChartCardUI
      isPending={false}
      userOpStats={data}
      project={props.project}
      wallets={props.wallets}
      teamSlug={props.teamSlug}
    />
  );
}

export function TransactionsChartCard(props: {
  searchParams: {
    from?: string | undefined | string[];
    to?: string | undefined | string[];
    interval?: string | undefined | string[];
  };
  project: Project;
  wallets: Wallet[];
  teamSlug: string;
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
          project={props.project}
          wallets={[]}
          teamSlug={props.teamSlug}
        />
      }
    >
      <AsyncTransactionsChartCard
        from={range.from.toISOString()}
        to={range.to.toISOString()}
        interval={interval}
        project={props.project}
        wallets={props.wallets}
        teamSlug={props.teamSlug}
      />
    </ResponsiveSuspense>
  );
}
