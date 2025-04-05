import { differenceInDays } from "date-fns";
import { ResponsiveSuspense } from "responsive-rsc";
import type { UserOpStats } from "../../../../../../../types/analytics";
import { getTxAnalyticsFiltersFromSearchParams } from "../getTransactionAnalyticsFilter";
import { TransactionsChartCardUI } from "./tx-chart-ui";

async function AsyncTransactionsChartCard(props: {
  from: string;
  to: string;
  interval: "day" | "week";
}) {
  // TODO - remove stub, implement it
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const data = getTransactionChartStub(props.from, props.to, props.interval);

  return <TransactionsChartCardUI isPending={false} userOpStats={data} />;
}

export function TransactionsChartCard(props: {
  searchParams: {
    from?: string | undefined | string[];
    to?: string | undefined | string[];
    interval?: string | undefined | string[];
  };
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
