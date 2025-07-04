"use server";

import { getWebhookSummary } from "@/api/analytics";
import type { WebhookSummaryStats } from "@/types/analytics";

export async function getWebhookSummaryAction(params: {
  teamId: string;
  projectId: string;
  webhookId: string;
  period?: "day" | "week" | "month" | "year" | "all";
  from?: Date;
  to?: Date;
}): Promise<WebhookSummaryStats | null> {
  try {
    const result = await getWebhookSummary(params);

    if ("error" in result) {
      console.error("Failed to fetch webhook summary:", result.error);
      return null;
    }

    return result.data[0] ?? null;
  } catch (error) {
    console.error("Unexpected error fetching webhook summary:", error);
    return null;
  }
}
