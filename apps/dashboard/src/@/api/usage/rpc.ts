import "server-only";
import { unstable_cache } from "next/cache";

export type RPCUsageDataItem = {
  date: string;
  usageType: "included" | "overage" | "rate-limit";
  count: string;
};

export const fetchRPCUsage = unstable_cache(
  async (params: {
    teamId: string;
    projectId?: string;
    authToken: string;
    from: string;
    to: string;
    period: "day" | "week" | "month" | "year" | "all";
  }) => {
    const analyticsEndpoint = process.env.ANALYTICS_SERVICE_URL as string;
    const url = new URL(`${analyticsEndpoint}/v2/rpc/usage-types`);
    url.searchParams.set("teamId", params.teamId);
    if (params.projectId) {
      url.searchParams.set("projectId", params.projectId);
    }
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
      data: resData.data as RPCUsageDataItem[],
    };
  },
  ["nebula-analytics"],
  {
    revalidate: 60 * 60, // 1 hour
  },
);
