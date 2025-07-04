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
  return (
    <WebhookAnalyticsCharts
      interval={interval}
      projectId={projectId}
      range={range}
      teamId={teamId}
      webhookConfigs={webhookConfigs}
    />
  );
}
