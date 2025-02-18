import "server-only";
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
    accountId: string;
    authToken: string;
    from: string;
    to: string;
    interval: "day" | "week";
  }) => {
    const analyticsEndpoint = process.env.ANALYTICS_SERVICE_URL as string;
    const url = new URL(`${analyticsEndpoint}/v1/nebula/usage`);
    url.searchParams.set("accountId", params.accountId);
    url.searchParams.set("from", params.from);
    url.searchParams.set("to", params.to);
    url.searchParams.set("interval", params.interval);

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
