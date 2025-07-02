"use client";

import { useQuery } from "@tanstack/react-query";
import { getAvailableTopics } from "@/api/webhook-configs";

export function useAvailableTopics({
  enabled = true,
}: {
  enabled?: boolean;
} = {}) {
  return useQuery({
    enabled,
    queryFn: async () => {
      const result = await getAvailableTopics();

      if (result.error) {
        throw new Error(result.error);
      }

      return result.data || [];
    },
    queryKey: ["webhook-topics"],
  });
}
