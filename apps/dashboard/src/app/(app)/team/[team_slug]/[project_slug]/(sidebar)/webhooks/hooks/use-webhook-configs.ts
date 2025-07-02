"use client";

import { useQuery } from "@tanstack/react-query";
import { getWebhookConfigs } from "@/api/webhook-configs";

interface UseWebhookConfigsParams {
  teamSlug: string;
  projectSlug: string;
  enabled?: boolean;
}

export function useWebhookConfigs({
  teamSlug,
  projectSlug,
  enabled = true,
}: UseWebhookConfigsParams) {
  return useQuery({
    enabled,
    queryFn: async () => {
      const result = await getWebhookConfigs({
        projectIdOrSlug: projectSlug,
        teamIdOrSlug: teamSlug,
      });

      if (result.error) {
        throw new Error(result.error);
      }

      return result.data || [];
    },
    queryKey: ["webhook-configs", teamSlug, projectSlug],
  });
}
