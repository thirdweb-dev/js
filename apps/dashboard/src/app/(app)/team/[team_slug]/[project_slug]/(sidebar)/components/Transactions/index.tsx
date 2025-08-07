import type { ThirdwebClient } from "thirdweb";
import { getClientTransactions } from "@/api/analytics";
import type { AnalyticsQueryParams } from "@/types/analytics";
import { TransactionsChartsUI } from "./TransactionCharts";

export async function TransactionsChartCardAsync(
  props: AnalyticsQueryParams & {
    selectedChartQueryParam: string;
    selectedChart: string | undefined;
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
      aggregatedData={aggregatedData}
      client={props.client}
      data={data}
      selectedChart={props.selectedChart}
      selectedChartQueryParam={props.selectedChartQueryParam}
    />
  );
}
