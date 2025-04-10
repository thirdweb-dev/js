import { differenceInDays } from "date-fns";
import { ResponsiveSuspense } from "responsive-rsc";
import { THIRDWEB_ENGINE_CLOUD_URL } from "../../../../../../../@/constants/env";
import type {
  TransactionStats,
  UserOpStats,
} from "../../../../../../../types/analytics";
import { getAuthToken } from "../../../../../../api/lib/getAuthToken";
import { getTxAnalyticsFiltersFromSearchParams } from "../getTransactionAnalyticsFilter";
import { TransactionsChartCardUI } from "./tx-chart-ui";

async function AsyncTransactionsChartCard(props: {
  from: string;
  to: string;
  interval: "day" | "week";
  teamId: string;
  clientId: string;
}) {
  const data = await getTransactionsChart({
    teamId: props.teamId,
    clientId: props.clientId,
    from: props.from,
    to: props.to,
    interval: props.interval,
  });

  return <TransactionsChartCardUI isPending={false} userOpStats={data} />;
}

export function TransactionsChartCard(props: {
  searchParams: {
    from?: string | undefined | string[];
    to?: string | undefined | string[];
    interval?: string | undefined | string[];
  };
  teamId: string;
  clientId: string;
}) {
  const { range, interval } = getTxAnalyticsFiltersFromSearchParams(
    props.searchParams,
  );

  return (
    <ResponsiveSuspense
      // TODO - change this if this component does not end up using these params
      searchParamsUsed={["from", "to", "interval"]}
      fallback={<TransactionsChartCardUI isPending={true} userOpStats={[]} />}
    >
      <AsyncTransactionsChartCard
        from={range.from.toISOString()}
        to={range.to.toISOString()}
        interval={interval}
        teamId={props.teamId}
        clientId={props.clientId}
      />
    </ResponsiveSuspense>
  );
}

// TODO: remove
function getTransactionChartStub(
  from: string,
  to: string,
  interval: "day" | "week",
) {
  const length = differenceInDays(new Date(to), new Date(from));
  const stub: UserOpStats[] = [];
  const startDate = new Date(from);
  const chainIdsToChooseFrom = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const increment = interval === "day" ? 1 : 7;

  for (let i = 0; i < length; i += increment) {
    // pick from 1 - 4
    const numberToTxPerDay = Math.floor(Math.random() * 4) + 1;

    for (let j = 0; j < numberToTxPerDay; j++) {
      stub.push({
        date: new Date(
          startDate.getTime() + i * 24 * 60 * 60 * 1000,
        ).toISOString(),
        successful: Math.floor(Math.random() * 100),
        failed: Math.floor(Math.random() * 100),
        sponsoredUsd: Math.floor(Math.random() * 100),
        chainId:
          chainIdsToChooseFrom[
            Math.floor(Math.random() * chainIdsToChooseFrom.length)
          ]?.toString(),
      });
    }
  }

  return stub;
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
