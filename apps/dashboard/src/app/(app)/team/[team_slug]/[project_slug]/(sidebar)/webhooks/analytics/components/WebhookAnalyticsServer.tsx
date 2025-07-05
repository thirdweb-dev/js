import { getWebhookLatency, getWebhookRequests } from "@/api/analytics";
import type { WebhookConfig } from "@/api/webhook-configs";
import type { Range } from "@/components/analytics/date-range-selector";
import { WebhookAnalyticsCharts } from "./WebhookAnalyticsCharts";

interface WebhookAnalyticsServerProps {
  teamId: string;
  projectId: string;
  webhookConfigs: WebhookConfig[];
  range: Range;
  interval: "day" | "week";
}

export async function WebhookAnalyticsServer({
  teamId,
  projectId,
  webhookConfigs,
  range,
  interval,
}: WebhookAnalyticsServerProps) {
  // Fetch webhook analytics data using the provided range and interval
  const [requestsData, latencyData] = await Promise.all([
    (async () => {
      const res = await getWebhookRequests({
        from: range.from,
        period: interval,
        projectId,
        teamId,
        to: range.to,
      });
      if ("error" in res) {
        console.error("Failed to fetch webhook requests:", res.error);
        return [];
      }
      return res.data;
    })(),
    (async () => {
      const res = await getWebhookLatency({
        from: range.from,
        period: interval,
        projectId,
        teamId,
        to: range.to,
      });
      if ("error" in res) {
        console.error("Failed to fetch webhook latency:", res.error);
        return [];
      }
      return res.data;
    })(),
  ]);

  return (
    <WebhookAnalyticsCharts
      latencyData={latencyData}
      range={range}
      requestsData={requestsData}
      webhookConfigs={webhookConfigs}
    />
  );
}
