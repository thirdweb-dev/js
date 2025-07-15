import type { WebhookConfig } from "@/api/webhook-configs";
import type {
  WebhookLatencyStats,
  WebhookRequestStats,
} from "@/types/analytics";
import { WebhookAnalyticsCharts } from "./WebhookAnalyticsCharts";

interface WebhookAnalyticsServerProps {
  webhookConfigs: WebhookConfig[];
  requestsData: WebhookRequestStats[];
  latencyData: WebhookLatencyStats[];
  selectedWebhookId: string;
}

export function WebhookAnalyticsServer({
  webhookConfigs,
  requestsData,
  latencyData,
  selectedWebhookId,
}: WebhookAnalyticsServerProps) {
  return (
    <WebhookAnalyticsCharts
      latencyData={latencyData}
      requestsData={requestsData}
      selectedWebhookId={selectedWebhookId}
      webhookConfigs={webhookConfigs}
    />
  );
}
