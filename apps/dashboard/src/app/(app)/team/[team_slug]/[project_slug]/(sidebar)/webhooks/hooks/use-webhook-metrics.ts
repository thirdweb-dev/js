"use client";

import { useQuery } from "@tanstack/react-query";
import { getWebhookMetricsAction } from "@/api/webhook-metrics";
import type { WebhookSummaryStats } from "@/types/analytics";

interface UseWebhookMetricsParams {
  webhookId: string;
  teamSlug: string;
  projectSlug: string;
  enabled?: boolean;
}

export function useWebhookMetrics({
  webhookId,
  teamSlug,
  projectSlug,
  enabled = true,
}: UseWebhookMetricsParams) {
  return useQuery<WebhookSummaryStats | null>({
    enabled: enabled && !!webhookId,
    queryFn: async (): Promise<WebhookSummaryStats | null> => {
      return await getWebhookMetricsAction({
        from: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
        period: "day",
        projectId: projectSlug,
        teamId: teamSlug,
        to: new Date(),
        webhookId,
      });
    },
    queryKey: ["webhook-metrics", teamSlug, projectSlug, webhookId],
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
}
