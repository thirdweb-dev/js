import type { ThirdwebClient } from "thirdweb";
import { getClientTransactions } from "@/api/analytics";
import type { AnalyticsQueryParams } from "@/types/analytics";
import { TransactionsChartsUI } from "./TransactionCharts";

export async function TransactionsChartCardAsync(props: {
  params: AnalyticsQueryParams;
  client: ThirdwebClient;
  selectedChartQueryParam: string;
  selectedChart: string | undefined;
  authToken: string;
}) {
  const { params, authToken, client, selectedChart, selectedChartQueryParam } =
    props;
  const [data, aggregatedData] = await Promise.all([
    getClientTransactions(params, authToken),
    getClientTransactions(
      {
        ...params,
        period: "all",
      },
      authToken,
    ),
  ]);

  if (!aggregatedData.length) {
    return null;
  }

  return (
    <TransactionsChartsUI
      aggregatedData={aggregatedData}
      client={client}
      data={data}
      selectedChart={selectedChart}
      selectedChartQueryParam={selectedChartQueryParam}
    />
  );
}
