import type { WebhookConfig } from "@/api/webhook-configs";
import type { Range } from "@/components/analytics/date-range-selector";
import type {
  WebhookLatencyStats,
  WebhookRequestStats,
} from "@/types/analytics";
import { WebhookAnalyticsServer } from "./WebhookAnalyticsServer";

interface WebhooksAnalyticsProps {
  teamId: string;
  teamSlug: string;
  projectId: string;
  projectSlug: string;
  range: Range;
  interval: "day" | "week";
  webhookConfigs: WebhookConfig[];
  requestsData: WebhookRequestStats[];
  latencyData: WebhookLatencyStats[];
  selectedWebhookId: string;
}

export function WebhooksAnalytics({
  teamId,
  projectId,
  range,
  interval,
  webhookConfigs,
  requestsData,
  latencyData,
  selectedWebhookId,
}: WebhooksAnalyticsProps) {
  return (
    <WebhookAnalyticsServer
      interval={interval}
      latencyData={latencyData}
      projectId={projectId}
      range={range}
      requestsData={requestsData}
      selectedWebhookId={selectedWebhookId}
      teamId={teamId}
      webhookConfigs={webhookConfigs}
    />
  );
}
