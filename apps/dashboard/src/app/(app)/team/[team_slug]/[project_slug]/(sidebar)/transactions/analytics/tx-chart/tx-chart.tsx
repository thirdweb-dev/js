import { ResponsiveSuspense } from "responsive-rsc";
import type { Project } from "@/api/project/projects";
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
    from: props.from,
    interval: props.interval,
    teamId: props.project.teamId,
    to: props.to,
  });

  return (
    <TransactionsChartCardUI
      isPending={false}
      project={props.project}
      teamSlug={props.teamSlug}
      userOpStats={data}
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
      fallback={
        <TransactionsChartCardUI
          isPending={true}
          project={props.project}
          teamSlug={props.teamSlug}
          userOpStats={[]}
          wallets={[]}
        />
      }
      searchParamsUsed={["from", "to", "interval"]}
    >
      <AsyncTransactionsChartCard
        from={range.from.toISOString()}
        interval={interval}
        project={props.project}
        teamSlug={props.teamSlug}
        to={range.to.toISOString()}
        wallets={props.wallets}
      />
    </ResponsiveSuspense>
  );
}
