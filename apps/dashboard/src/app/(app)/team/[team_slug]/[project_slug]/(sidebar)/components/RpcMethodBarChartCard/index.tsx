import { LoadingChartState } from "components/analytics/empty-chart-state";
import { Suspense } from "react";
import type { AnalyticsQueryParams } from "types/analytics";
import { getRpcMethodUsage } from "@/api/analytics";
import { RpcMethodBarChartCardUI } from "./RpcMethodBarChartCardUI";

export function RpcMethodBarChartCard(props: AnalyticsQueryParams) {
  return (
    // TODO: Add better LoadingChartState
    <Suspense fallback={<LoadingChartState className="h-[377px] border" />}>
      <RpcMethodBarChartCardAsync {...props} />
    </Suspense>
  );
}

async function RpcMethodBarChartCardAsync(props: AnalyticsQueryParams) {
  const rawData = await getRpcMethodUsage(props);

  return <RpcMethodBarChartCardUI rawData={rawData} />;
}
