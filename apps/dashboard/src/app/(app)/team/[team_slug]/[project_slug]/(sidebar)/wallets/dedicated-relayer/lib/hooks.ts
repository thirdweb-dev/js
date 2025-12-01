"use client";

import { useQuery } from "@tanstack/react-query";
import { type GetFleetAnalyticsParams, getFleetAnalytics } from "./api";

export function useFleetAnalytics(
  params: GetFleetAnalyticsParams & { enabled?: boolean },
) {
  return useQuery({
    queryKey: [
      "fleet-analytics",
      params.teamId,
      params.projectId,
      params.startDate,
      params.endDate,
    ],
    queryFn: () => getFleetAnalytics(params),
    refetchOnWindowFocus: false,
    enabled: params.enabled ?? true,
  });
}
