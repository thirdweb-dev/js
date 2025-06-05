import "server-only";
import { unstable_cache } from "next/cache";
import { ANALYTICS_SERVICE_URL } from "../../constants/server-envs";

type Last24HoursRPCUsageApiResponse = {
  peakRate: {
    date: string;
    peakRPS: string;
  };
  averageRate: {
    date: string;
    averageRate: string;
    peakRPS: string;
    includedCount: string;
    rateLimitedCount: string;
    overageCount: string;
  }[];
  totalCounts: {
    includedCount: string;
    rateLimitedCount: string;
    overageCount: string;
  };
};

export const getLast24HoursRPCUsage = unstable_cache(
  async (params: {
    teamId: string;
    projectId?: string;
    authToken: string;
  }) => {
    const analyticsEndpoint = ANALYTICS_SERVICE_URL;
    const url = new URL(`${analyticsEndpoint}/v2/rpc/24-hours`);
    url.searchParams.set("teamId", params.teamId);
    if (params.projectId) {
      url.searchParams.set("projectId", params.projectId);
    }

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
      data: resData.data as Last24HoursRPCUsageApiResponse,
    };
  },
  ["rpc-usage-last-24-hours:v2"],
  {
    revalidate: 60, // 1 minute
  },
);
