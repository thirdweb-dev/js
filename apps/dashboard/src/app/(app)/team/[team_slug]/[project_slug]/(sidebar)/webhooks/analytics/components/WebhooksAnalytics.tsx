import { getWebhookConfigs } from "@/api/webhook-configs";
import type { Range } from "@/components/analytics/date-range-selector";
import { WebhookAnalyticsServer } from "./WebhookAnalyticsServer";

interface WebhooksAnalyticsProps {
  teamId: string;
  teamSlug: string;
  projectId: string;
  projectSlug: string;
  range: Range;
  interval: "day" | "week";
}

export async function WebhooksAnalytics({
  teamId,
  teamSlug,
  projectId,
  projectSlug,
  range,
  interval,
}: WebhooksAnalyticsProps) {
  const webhookConfigsResponse = await getWebhookConfigs({
    projectIdOrSlug: projectSlug,
    teamIdOrSlug: teamSlug,
  }).catch(() => ({ data: [], error: "Failed to fetch webhook configs" }));

  if (
    webhookConfigsResponse.error ||
    !webhookConfigsResponse.data ||
    webhookConfigsResponse.data.length === 0
  ) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">
          No webhook configurations found.
        </p>
      </div>
    );
  }

  return (
    <WebhookAnalyticsServer
      interval={interval}
      projectId={projectId}
      range={range}
      teamId={teamId}
      webhookConfigs={webhookConfigsResponse.data}
    />
  );
}
