"use client";

import { useQuery } from "@tanstack/react-query";
import { getWebhookMetricsAction } from "@/api/webhook-metrics";
import type { WebhookSummaryStats } from "@/types/analytics";

interface UseWebhookMetricsParams {
  webhookId: string;
  teamId: string;
  projectId: string;
  enabled?: boolean;
}

export function useWebhookMetrics({
  webhookId,
  teamId,
  projectId,
  enabled = true,
}: UseWebhookMetricsParams) {
  return useQuery<WebhookSummaryStats | null>({
    enabled: enabled && !!webhookId,
    queryFn: async (): Promise<WebhookSummaryStats | null> => {
      return await getWebhookMetricsAction({
        from: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
        period: "day",
        projectId,
        teamId,
        to: new Date(),
        webhookId,
      });
    },
    queryKey: ["webhook-metrics", teamId, projectId, webhookId],
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
}
