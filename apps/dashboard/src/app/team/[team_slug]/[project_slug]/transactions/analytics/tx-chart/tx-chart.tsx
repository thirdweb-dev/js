import { ResponsiveSuspense } from "responsive-rsc";
import { THIRDWEB_ENGINE_CLOUD_URL } from "../../../../../../../@/constants/env";
import type { TransactionStats } from "../../../../../../../types/analytics";
import { getAuthToken } from "../../../../../../api/lib/getAuthToken";
import { getTxAnalyticsFiltersFromSearchParams } from "../getTransactionAnalyticsFilter";
import { TransactionsChartCardUI } from "./tx-chart-ui";

async function AsyncTransactionsChartCard(props: {
  from: string;
  to: string;
  interval: "day" | "week";
  teamId: string;
  clientId: string;
  project_slug: string;
  team_slug: string;
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
      />
    </ResponsiveSuspense>
  );
}

async function getTransactionsChart({
  teamId,
  clientId,
  from,
  to,
  interval,
}: {
  teamId: string;
  clientId: string;
  from: string;
  to: string;
  interval: "day" | "week";
}): Promise<TransactionStats[]> {
  const authToken = await getAuthToken();

  const filters = {
    startDate: from,
    endDate: to,
    resolution: interval,
  };

  const response = await fetch(
    `${THIRDWEB_ENGINE_CLOUD_URL}/project/transactions/analytics`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-team-id": teamId,
        "x-client-id": clientId,
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(filters),
    },
  );

  if (!response.ok) {
    throw new Error(
      `Error fetching transactions chart data: ${response.status} ${response.statusText}`,
    );
  }

  type TransactionsChartResponse = {
    result: {
      analytics: Array<{
        timeBucket: string;
        chainId: string;
        count: number;
      }>;
      metadata: {
        resolution: string;
        startDate: string;
        endDate: string;
      };
    };
  };

  const data = (await response.json()) as TransactionsChartResponse;

  return data.result.analytics.map((stat) => ({
    date: stat.timeBucket,
    chainId: Number(stat.chainId),
    count: stat.count,
  }));
}
