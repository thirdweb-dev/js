import type { WebhookConfig } from "@/api/webhook-configs";
import type { Range } from "@/components/analytics/date-range-selector";
import type {
  WebhookLatencyStats,
  WebhookRequestStats,
} from "@/types/analytics";
import { WebhookAnalyticsCharts } from "./WebhookAnalyticsCharts";

interface WebhookAnalyticsServerProps {
  teamId: string;
  projectId: string;
  webhookConfigs: WebhookConfig[];
  range: Range;
  interval: "day" | "week";
  requestsData: WebhookRequestStats[];
  latencyData: WebhookLatencyStats[];
  selectedWebhookId: string;
}

export function WebhookAnalyticsServer({
  teamId,
  projectId,
  webhookConfigs,
  range,
  interval,
  requestsData,
  latencyData,
  selectedWebhookId,
}: WebhookAnalyticsServerProps) {
  return (
    <WebhookAnalyticsCharts
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
