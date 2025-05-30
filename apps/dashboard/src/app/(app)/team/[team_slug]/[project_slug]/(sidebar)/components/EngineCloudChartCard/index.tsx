import { getEngineCloudMethodUsage } from "@/api/analytics";
import { LoadingChartState } from "components/analytics/empty-chart-state";
import { Suspense } from "react";
import type { AnalyticsQueryParams } from "types/analytics";
import { EngineCloudBarChartCardUI } from "./EngineCloudBarChartCardUI";

export function EngineCloudChartCard(props: AnalyticsQueryParams) {
  return (
    <Suspense
      fallback={
        <div className="h-[400px]">
          <LoadingChartState />
        </div>
      }
    >
      <EngineCloudChartCardAsync {...props} />
    </Suspense>
  );
}

async function EngineCloudChartCardAsync(props: AnalyticsQueryParams) {
  const rawData = await getEngineCloudMethodUsage(props);

  return <EngineCloudBarChartCardUI rawData={rawData} />;
}
