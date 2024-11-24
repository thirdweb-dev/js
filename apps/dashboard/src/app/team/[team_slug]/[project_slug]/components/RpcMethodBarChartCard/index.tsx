import { getRpcMethodUsage } from "@/api/analytics";
import { LoadingChartState } from "components/analytics/empty-chart-state";
import { Suspense } from "react";
import type { AnalyticsQueryParams } from "types/analytics";
import { RpcMethodBarChartCardUI } from "./RpcMethodBarChartCardUI";

export function RpcMethodBarChartCard(props: AnalyticsQueryParams) {
  return (
    // TODO: Add better LoadingChartState
    <Suspense
      fallback={
        <div className="h-[400px]">
          <LoadingChartState />
        </div>
      }
    >
      <RpcMethodBarChartCardAsync {...props} />
    </Suspense>
  );
}

async function RpcMethodBarChartCardAsync(props: AnalyticsQueryParams) {
  const rawData = await getRpcMethodUsage(props);

  return <RpcMethodBarChartCardUI rawData={rawData} />;
}
