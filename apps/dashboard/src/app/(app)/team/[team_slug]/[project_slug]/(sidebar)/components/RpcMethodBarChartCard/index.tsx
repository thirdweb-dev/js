import { getRpcMethodUsage } from "@/api/analytics";
import type { AnalyticsQueryParams } from "@/types/analytics";
import { RpcMethodBarChartCardUI } from "./RpcMethodBarChartCardUI";

export async function RpcMethodBarChartCardAsync(props: {
  params: AnalyticsQueryParams;
  authToken: string;
}) {
  const rawData = await getRpcMethodUsage(props.params, props.authToken);
  return <RpcMethodBarChartCardUI rawData={rawData} />;
}
