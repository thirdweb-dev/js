"use server";

import { getWebhookMetrics } from "@/api/analytics";
import type { WebhookSummaryStats } from "@/types/analytics";

export async function getWebhookMetricsAction(params: {
  teamId: string;
  projectId: string;
  webhookId: string;
  period?: "day" | "week" | "month" | "year" | "all";
  from?: Date;
  to?: Date;
}): Promise<WebhookSummaryStats | null> {
  const metrics = await getWebhookMetrics(params);
  return metrics[0] || null;
}
