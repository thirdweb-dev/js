import type { WebhookConfig } from "@/api/project/webhook-configs";
import type {
  WebhookLatencyStats,
  WebhookRequestStats,
} from "@/types/analytics";
import { WebhookAnalyticsServer } from "./WebhookAnalyticsServer";

interface WebhooksAnalyticsProps {
  webhookConfigs: WebhookConfig[];
  requestsData: WebhookRequestStats[];
  latencyData: WebhookLatencyStats[];
  selectedWebhookId: string;
}

export function WebhooksAnalytics({
  webhookConfigs,
  requestsData,
  latencyData,
  selectedWebhookId,
}: WebhooksAnalyticsProps) {
  return (
    <WebhookAnalyticsServer
      latencyData={latencyData}
      requestsData={requestsData}
      selectedWebhookId={selectedWebhookId}
      webhookConfigs={webhookConfigs}
    />
  );
}
