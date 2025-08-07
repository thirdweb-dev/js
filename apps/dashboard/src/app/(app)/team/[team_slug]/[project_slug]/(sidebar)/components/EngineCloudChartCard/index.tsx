import { getEngineCloudMethodUsage } from "@/api/analytics";
import type { AnalyticsQueryParams } from "@/types/analytics";
import { EngineCloudBarChartCardUI } from "./EngineCloudBarChartCardUI";

export async function EngineCloudChartCardAsync(props: AnalyticsQueryParams) {
  const rawData = await getEngineCloudMethodUsage(props);
  return <EngineCloudBarChartCardUI rawData={rawData} />;
}
