import "server-only";
import { ANALYTICS_SERVICE_URL } from "@/constants/server-envs";
import { unstable_cache } from "next/cache";

export type NebulaAnalyticsDataItem = {
  date: string;
  totalPromptTokens: number;
  totalCompletionTokens: number;
  totalSessions: number;
  totalRequests: number;
};

export const fetchNebulaAnalytics = unstable_cache(
  async (params: {
    teamId: string;
    projectId: string;
    authToken: string;
    from: string;
    to: string;
    period: "day" | "week" | "month" | "year" | "all";
  }) => {
    const analyticsEndpoint = ANALYTICS_SERVICE_URL;
    const url = new URL(`${analyticsEndpoint}/v2/nebula/usage`);
    url.searchParams.set("teamId", params.teamId);
    url.searchParams.set("projectId", params.projectId);
    url.searchParams.set("from", params.from);
    url.searchParams.set("to", params.to);
    url.searchParams.set("period", params.period);

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${params.authToken}`,
      },
    });

    if (!res.ok) {
      const error = await res.text();
      return {
        ok: false as const,
        error: error,
      };
    }

    const resData = await res.json();

    return {
      ok: true as const,
      data: resData.data as NebulaAnalyticsDataItem[],
    };
  },
  ["nebula-analytics"],
  {
    revalidate: 60 * 60, // 1 hour
  },
);
