import { getClientTransactions } from "@/api/analytics";
import { LoadingChartState } from "components/analytics/empty-chart-state";
import { Suspense } from "react";
import type { ThirdwebClient } from "thirdweb";
import type { AnalyticsQueryParams } from "types/analytics";
import { TransactionsChartsUI } from "./TransactionCharts";

export function TransactionsCharts(
  props: AnalyticsQueryParams & {
    searchParams: { [key: string]: string | string[] | undefined };
    client: ThirdwebClient;
  },
) {
  return (
    // TODO: Add better LoadingChartState
    <Suspense fallback={<LoadingChartState className="h-[458px] border" />}>
      <TransactionsChartCardAsync {...props} />
    </Suspense>
  );
}

async function TransactionsChartCardAsync(
  props: AnalyticsQueryParams & {
    searchParams: { [key: string]: string | string[] | undefined };
    client: ThirdwebClient;
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
      client={props.client}
    />
  );
}
