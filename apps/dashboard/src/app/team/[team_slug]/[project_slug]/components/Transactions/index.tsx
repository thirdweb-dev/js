import { LoadingChartState } from "components/analytics/empty-chart-state";
import { Suspense } from "react";
import type { AnalyticsQueryParams } from "types/analytics";
import { getClientTransactions } from "../../../../../../@/api/analytics";
import { TransactionsChartsUI } from "./TransactionCharts";

export function TransactionsCharts(
  props: AnalyticsQueryParams & {
    searchParams: { [key: string]: string | string[] | undefined };
  },
) {
  return (
    // TODO: Add better LoadingChartState
    <Suspense
      fallback={
        <div className="h-[400px]">
          <LoadingChartState />
        </div>
      }
    >
      <TransactionsChartCardAsync {...props} />
    </Suspense>
  );
}

async function TransactionsChartCardAsync(
  props: AnalyticsQueryParams & {
    searchParams: { [key: string]: string | string[] | undefined };
  },
) {
  const [data, aggregatedData] = await Promise.all([
    getClientTransactions(props),
    getClientTransactions({
      ...props,
      period: "all",
    }),
  ]);

  if (!aggregatedData.length) {
    return null;
  }

  return (
    <TransactionsChartsUI
      data={data}
      aggregatedData={aggregatedData}
      searchParams={props.searchParams}
    />
  );
}
