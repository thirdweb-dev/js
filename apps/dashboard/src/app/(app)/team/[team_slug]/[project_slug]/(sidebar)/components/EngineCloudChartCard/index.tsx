import { getEngineCloudMethodUsage } from "@/api/analytics";
import type { AnalyticsQueryParams } from "@/types/analytics";
import { EngineCloudBarChartCardUI } from "./EngineCloudBarChartCardUI";

export async function EngineCloudChartCardAsync(props: {
  params: AnalyticsQueryParams;
  authToken: string;
}) {
  const rawData = await getEngineCloudMethodUsage(
    props.params,
    props.authToken,
  );
  return <EngineCloudBarChartCardUI rawData={rawData} />;
}
