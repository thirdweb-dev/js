import { getRpcMethodUsage } from "@/api/analytics";
import type { AnalyticsQueryParams } from "@/types/analytics";
import { RpcMethodBarChartCardUI } from "./RpcMethodBarChartCardUI";

export async function RpcMethodBarChartCardAsync(props: AnalyticsQueryParams) {
  const rawData = await getRpcMethodUsage(props);

  return <RpcMethodBarChartCardUI rawData={rawData} />;
}
