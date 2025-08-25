import "server-only";

import { unstable_cache } from "next/cache";
import { ANALYTICS_SERVICE_URL } from "@/constants/server-envs";
import { normalizeTime } from "@/lib/time";
import type {
  AIUsageStats,
  AnalyticsQueryParams,
  EcosystemWalletStats,
  EngineCloudStats,
  InAppWalletStats,
  TransactionStats,
  UniversalBridgeStats,
  UniversalBridgeWalletStats,
  UserOpStats,
  WalletStats,
  WebhookLatencyStats,
  WebhookSummaryStats,
} from "@/types/analytics";
import { getChains } from "./chain";

export interface InsightChainStats {
  date: string;
  chainId: string;
  totalRequests: number;
}

export interface InsightStatusCodeStats {
  date: string;
  httpStatusCode: number;
  totalRequests: number;
}

export interface InsightEndpointStats {
  date: string;
  endpoint: string;
  totalRequests: number;
}

interface InsightUsageStats {
  date: string;
  totalRequests: number;
}

export interface RpcMethodStats {
  date: string;
  evmMethod: string;
  count: number;
}

export interface RpcUsageTypeStats {
  date: string;
  usageType: string;
  count: number;
}

function normalizedParams<T extends { from?: Date; to?: Date }>(params: T): T {
  return {
    ...params,
    from: params.from ? normalizeTime(params.from) : undefined,
    to: params.to ? normalizeTime(params.to) : undefined,
  };
}

async function fetchAnalytics(params: {
  authToken: string;
  url: string | URL;
  init?: RequestInit;
}): Promise<Response> {
  const [pathname, searchParams] = params.url.toString().split("?");
  if (!pathname) {
    throw new Error("Invalid input, no pathname provided");
  }

  // create a new URL object for the analytics server
  const analyticsServiceUrl = new URL(
    ANALYTICS_SERVICE_URL || "https://analytics.thirdweb.com",
  );

  analyticsServiceUrl.pathname = pathname;
  for (const param of searchParams?.split("&") || []) {
    const [key, value] = param.split("=");
    if (!key || !value) {
      throw new Error("Invalid input, no key or value provided");
    }
    analyticsServiceUrl.searchParams.append(
      decodeURIComponent(key),
      decodeURIComponent(value),
    );
  }

  return fetch(analyticsServiceUrl, {
    ...params.init,
    headers: {
      Authorization: `Bearer ${params.authToken}`,
      ...params.init?.headers,
    },
  });
}

function buildSearchParams(params: AnalyticsQueryParams): URLSearchParams {
  const searchParams = new URLSearchParams();

  searchParams.append("teamId", params.teamId);

  if (params.projectId) {
    searchParams.append("projectId", params.projectId);
  }

  // shared params
  if (params.from) {
    searchParams.append("from", params.from.toISOString());
  }
  if (params.to) {
    searchParams.append("to", params.to.toISOString());
  }
  if (params.period) {
    searchParams.append("period", params.period);
  }
  if (params.limit) {
    searchParams.append("limit", params.limit.toString());
  }
  return searchParams;
}

const cached_getWalletConnections = unstable_cache(
  async (
    params: AnalyticsQueryParams,
    authToken: string,
  ): Promise<WalletStats[]> => {
    const searchParams = buildSearchParams(params);
    const res = await fetchAnalytics({
      authToken,
      url: `v2/sdk/wallet-connects?${searchParams.toString()}`,
      init: {
        method: "GET",
      },
    });

    if (res?.status !== 200) {
      const reason = await res?.text();
      console.error(
        `Failed to fetch wallet connections, ${res?.status} - ${res.statusText} - ${reason}`,
      );
      return [];
    }

    const json = await res.json();
    return (json.data as WalletStats[]).filter(
      (w) =>
        w.walletType !== "smart" &&
        w.walletType !== "smartWallet" &&
        w.walletType !== "inApp" &&
        w.walletType !== "inAppWallet",
    );
  },
  ["getWalletConnections"],
  {
    revalidate: 60 * 60, // 1 hour
  },
);

export function getWalletConnections(
  params: AnalyticsQueryParams,
  authToken: string,
) {
  return cached_getWalletConnections(normalizedParams(params), authToken);
}

const cached_getInAppWalletUsage = unstable_cache(
  async (
    params: AnalyticsQueryParams,
    authToken: string,
  ): Promise<InAppWalletStats[]> => {
    const searchParams = buildSearchParams(params);
    const res = await fetchAnalytics({
      authToken,
      url: `v2/wallet/connects?${searchParams.toString()}`,
      init: {
        method: "GET",
      },
    });

    if (res?.status !== 200) {
      const reason = await res?.text();
      console.error(
        `Failed to fetch in-app wallet usage, ${res?.status} - ${res.statusText} - ${reason}`,
      );
      return [];
    }

    const json = await res.json();
    return json.data as InAppWalletStats[];
  },
  ["getInAppWalletUsage"],
  {
    revalidate: 60 * 60, // 1 hour
  },
);

export function getInAppWalletUsage(
  params: AnalyticsQueryParams,
  authToken: string,
) {
  return cached_getInAppWalletUsage(normalizedParams(params), authToken);
}

const cached_getAiUsage = unstable_cache(
  async (
    params: AnalyticsQueryParams,
    authToken: string,
  ): Promise<AIUsageStats[]> => {
    const searchParams = buildSearchParams(params);
    const res = await fetchAnalytics({
      authToken,
      url: `v2/nebula/usage?${searchParams.toString()}`,
      init: {
        method: "GET",
      },
    });

    if (res?.status !== 200) {
      const reason = await res?.text();
      console.error(
        `Failed to fetch AI usage, ${res?.status} - ${res.statusText} - ${reason}`,
      );
      return [];
    }

    const json = await res.json();
    return json.data as AIUsageStats[];
  },
  ["getAiUsage"],
  {
    revalidate: 60 * 60, // 1 hour
  },
);

export function getAiUsage(params: AnalyticsQueryParams, authToken: string) {
  return cached_getAiUsage(normalizedParams(params), authToken);
}

const cached_getUserOpUsage = unstable_cache(
  async (
    params: AnalyticsQueryParams,
    authToken: string,
  ): Promise<UserOpStats[]> => {
    const searchParams = buildSearchParams(params);
    const res = await fetchAnalytics({
      authToken,
      url: `v2/bundler/usage?${searchParams.toString()}`,
      init: {
        method: "GET",
      },
    });

    if (res?.status !== 200) {
      const reason = await res?.text();
      console.error(
        `Failed to fetch user ops usage: ${res?.status} - ${res.statusText} - ${reason}`,
      );
      return [];
    }

    const json = await res.json();
    return json.data as UserOpStats[];
  },
  ["getUserOpUsage"],
  {
    revalidate: 60 * 60, // 1 hour
  },
);

export function getUserOpUsage(
  params: AnalyticsQueryParams,
  authToken: string,
) {
  return cached_getUserOpUsage(normalizedParams(params), authToken);
}

const cached_getAggregateUserOpUsage = unstable_cache(
  async (
    params: Omit<AnalyticsQueryParams, "period">,
    authToken: string,
  ): Promise<UserOpStats> => {
    const [userOpStats, chains] = await Promise.all([
      getUserOpUsage({ ...params, period: "all" }, authToken),
      getChains(),
    ]);

    // Aggregate stats across wallet types
    return userOpStats.reduce(
      (acc, curr) => {
        // Skip testnets from the aggregated stats
        if (curr.chainId) {
          const chain = chains.data.find(
            (c) => c.chainId.toString() === curr.chainId,
          );
          if (chain?.testnet) {
            return acc;
          }
        }

        acc.successful += curr.successful;
        acc.failed += curr.failed;
        acc.sponsoredUsd += curr.sponsoredUsd;
        return acc;
      },
      {
        date: (params.from || new Date()).toISOString(),
        failed: 0,
        sponsoredUsd: 0,
        successful: 0,
      },
    );
  },
  ["getAggregateUserOpUsage"],
  {
    revalidate: 60 * 60, // 1 hour
  },
);

export function getAggregateUserOpUsage(
  params: Omit<AnalyticsQueryParams, "period">,
  authToken: string,
) {
  return cached_getAggregateUserOpUsage(normalizedParams(params), authToken);
}

const cached_getClientTransactions = unstable_cache(
  async (
    params: AnalyticsQueryParams,
    authToken: string,
  ): Promise<TransactionStats[]> => {
    const searchParams = buildSearchParams(params);

    const res = await fetchAnalytics({
      authToken,
      url: `v2/sdk/contract-transactions?${searchParams.toString()}`,
      init: {
        method: "GET",
      },
    });

    if (res?.status !== 200) {
      const reason = await res?.text();
      console.error(
        `Failed to fetch client transactions stats: ${res?.status} - ${res.statusText} - ${reason}`,
      );
      return [];
    }

    const json = await res.json();
    return json.data as TransactionStats[];
  },
  ["getClientTransactions"],
  {
    revalidate: 60 * 60, // 1 hour
  },
);

export function getClientTransactions(
  params: AnalyticsQueryParams,
  authToken: string,
) {
  return cached_getClientTransactions(normalizedParams(params), authToken);
}

const cached_getRpcMethodUsage = unstable_cache(
  async (
    params: AnalyticsQueryParams,
    authToken: string,
  ): Promise<RpcMethodStats[]> => {
    const searchParams = buildSearchParams(params);

    const res = await fetchAnalytics({
      authToken,
      url: `v2/rpc/evm-methods?${searchParams.toString()}`,
      init: {
        method: "GET",
      },
    });

    if (res?.status !== 200) {
      console.error("Failed to fetch RPC method usage");
      return [];
    }

    const json = await res.json();
    return json.data as RpcMethodStats[];
  },
  ["getRpcMethodUsage"],
  {
    revalidate: 60 * 60, // 1 hour
  },
);

export function getRpcMethodUsage(
  params: AnalyticsQueryParams,
  authToken: string,
) {
  return cached_getRpcMethodUsage(normalizedParams(params), authToken);
}

const cached_getRpcUsageByType = unstable_cache(
  async (
    params: AnalyticsQueryParams,
    authToken: string,
  ): Promise<RpcUsageTypeStats[]> => {
    const searchParams = buildSearchParams(params);

    const res = await fetchAnalytics({
      authToken,
      url: `v2/rpc/usage-types?${searchParams.toString()}`,
      init: {
        method: "GET",
      },
    });

    if (res?.status !== 200) {
      console.error("Failed to fetch RPC usage");
      return [];
    }

    const json = await res.json();
    return json.data as RpcUsageTypeStats[];
  },
  ["getRpcUsageByType"],
  {
    revalidate: 60 * 60, // 1 hour
  },
);

export function getRpcUsageByType(
  params: AnalyticsQueryParams,
  authToken: string,
) {
  return cached_getRpcUsageByType(normalizedParams(params), authToken);
}

type ActiveStatus = {
  bundler: boolean;
  storage: boolean;
  rpc: boolean;
  nebula: boolean;
  sdk: boolean;
  insight: boolean;
  pay: boolean;
  inAppWallet: boolean;
  ecosystemWallet: boolean;
};

export const isProjectActive = unstable_cache(
  async (params: {
    teamId: string;
    projectId: string;
    authToken: string;
  }): Promise<ActiveStatus> => {
    const searchParams = buildSearchParams(params);
    const res = await fetchAnalytics({
      authToken: params.authToken,
      url: `v2/active-usage?${searchParams.toString()}`,
      init: {
        method: "GET",
      },
    });

    if (res?.status !== 200) {
      const reason = await res?.text();
      console.error(
        `Failed to fetch project active status: ${res?.status} - ${res.statusText} - ${reason}`,
      );
      return {
        bundler: false,
        ecosystemWallet: false,
        inAppWallet: false,
        insight: false,
        nebula: false,
        pay: false,
        rpc: false,
        sdk: false,
        storage: false,
      } as ActiveStatus;
    }

    const json = await res.json();
    return json.data as ActiveStatus;
  },
  ["isProjectActive"],
  {
    revalidate: 60 * 60, // 1 hour
  },
);

type EcosystemWalletUsageParams = {
  teamId: string;
  ecosystemSlug: string;
  ecosystemPartnerId?: string;
  projectId?: string;
  from?: Date;
  to?: Date;
  period?: "day" | "week" | "month" | "year" | "all";
};

const cached_getEcosystemWalletUsage = unstable_cache(
  async (args: EcosystemWalletUsageParams, authToken: string) => {
    const {
      ecosystemSlug,
      ecosystemPartnerId,
      teamId,
      projectId,
      from,
      to,
      period,
    } = args;

    const searchParams = new URLSearchParams();
    // required params
    searchParams.append("ecosystemSlug", ecosystemSlug);
    searchParams.append("teamId", teamId);

    // optional params
    if (ecosystemPartnerId) {
      searchParams.append("ecosystemPartnerId", ecosystemPartnerId);
    }
    if (projectId) {
      searchParams.append("projectId", projectId);
    }
    if (from) {
      searchParams.append("from", from.toISOString());
    }
    if (to) {
      searchParams.append("to", to.toISOString());
    }
    if (period) {
      searchParams.append("period", period);
    }

    const res = await fetchAnalytics({
      authToken: authToken,
      url: `v2/wallet/connects?${searchParams.toString()}`,
      init: {
        method: "GET",
      },
    });

    if (res?.status !== 200) {
      const reason = await res?.text();
      console.error(
        `Failed to fetch ecosystem wallet stats: ${res?.status} - ${res.statusText} - ${reason}`,
      );
      return null;
    }

    const json = await res.json();

    return json.data as EcosystemWalletStats[];
  },
  ["getEcosystemWalletUsage"],
  {
    revalidate: 60 * 60, // 1 hour
  },
);

export function getEcosystemWalletUsage(
  params: EcosystemWalletUsageParams,
  authToken: string,
) {
  return cached_getEcosystemWalletUsage(normalizedParams(params), authToken);
}

type UniversalBridgeUsageParams = {
  teamId: string;
  projectId?: string;
  from?: Date;
  to?: Date;
  period?: "day" | "week" | "month" | "year" | "all";
};

const cached_getUniversalBridgeUsage = unstable_cache(
  async (args: UniversalBridgeUsageParams, authToken: string) => {
    const searchParams = buildSearchParams(args);

    const res = await fetchAnalytics({
      authToken,
      url: `v2/universal?${searchParams.toString()}`,
      init: {
        method: "GET",
      },
    });

    if (res?.status !== 200) {
      const reason = await res?.text();
      console.error(
        `Failed to fetch universal bridge stats: ${res?.status} - ${res.statusText} - ${reason}`,
      );
      return [];
    }

    const json = await res.json();
    return json.data as UniversalBridgeStats[];
  },
  ["getUniversalBridgeUsage"],
  {
    revalidate: 60 * 60, // 1 hour
  },
);

export function getUniversalBridgeUsage(
  params: UniversalBridgeUsageParams,
  authToken: string,
) {
  return cached_getUniversalBridgeUsage(normalizedParams(params), authToken);
}

type UniversalBridgeWalletUsageParams = {
  teamId: string;
  projectId: string;
  from?: Date;
  to?: Date;
  period?: "day" | "week" | "month" | "year" | "all";
};

const cached_getUniversalBridgeWalletUsage = unstable_cache(
  async (args: UniversalBridgeWalletUsageParams, authToken: string) => {
    const searchParams = buildSearchParams(args);

    const res = await fetchAnalytics({
      authToken,
      url: `v2/universal/wallets?${searchParams.toString()}`,
      init: {
        method: "GET",
      },
    });

    if (res?.status !== 200) {
      const reason = await res?.text();
      console.error(
        `Failed to fetch universal bridge wallet stats: ${res?.status} - ${res.statusText} - ${reason}`,
      );
      return [];
    }

    const json = await res.json();
    return json.data as UniversalBridgeWalletStats[];
  },
  ["getUniversalBridgeWalletUsage"],
  {
    revalidate: 60 * 60, // 1 hour
  },
);

export function getUniversalBridgeWalletUsage(
  params: UniversalBridgeWalletUsageParams,
  authToken: string,
) {
  return cached_getUniversalBridgeWalletUsage(
    normalizedParams(params),
    authToken,
  );
}

const cached_getEngineCloudMethodUsage = unstable_cache(
  async (
    params: AnalyticsQueryParams,
    authToken: string,
  ): Promise<EngineCloudStats[]> => {
    const searchParams = buildSearchParams(params);
    const res = await fetchAnalytics({
      authToken,
      url: `v2/engine-cloud/requests?${searchParams.toString()}`,
      init: {
        method: "GET",
      },
    });

    if (res?.status !== 200) {
      console.error("Failed to fetch Engine Cloud method usage");
      return [];
    }

    const json = await res.json();
    return json.data as EngineCloudStats[];
  },
  ["getEngineCloudMethodUsage"],
  {
    revalidate: 60 * 60, // 1 hour
  },
);

export function getEngineCloudMethodUsage(
  params: AnalyticsQueryParams,
  authToken: string,
) {
  return cached_getEngineCloudMethodUsage(normalizedParams(params), authToken);
}

const _cached_getWebhookSummary = unstable_cache(
  async (
    params: AnalyticsQueryParams & { webhookId: string },
    authToken: string,
  ): Promise<{ data: WebhookSummaryStats[] } | { error: string }> => {
    const searchParams = buildSearchParams(params);
    searchParams.append("webhookId", params.webhookId);

    const res = await fetchAnalytics({
      authToken,
      url: `v2/webhook/summary?${searchParams.toString()}`,
      init: {
        method: "GET",
      },
    });
    if (!res.ok) {
      const reason = await res.text();
      return { error: reason };
    }

    return (await res.json()) as { data: WebhookSummaryStats[] };
  },
  ["getWebhookSummary"],
  {
    revalidate: 60 * 60, // 1 hour
  },
);

const _cached_getWebhookLatency = unstable_cache(
  async (
    params: AnalyticsQueryParams & { webhookId?: string },
    authToken: string,
  ): Promise<{ data: WebhookLatencyStats[] } | { error: string }> => {
    const searchParams = buildSearchParams(params);
    if (params.webhookId) {
      searchParams.append("webhookId", params.webhookId);
    }

    const res = await fetchAnalytics({
      authToken,
      url: `v2/webhook/latency?${searchParams.toString()}`,
      init: {
        method: "GET",
      },
    });
    if (!res.ok) {
      const reason = await res.text();
      return { error: reason };
    }

    return (await res.json()) as { data: WebhookLatencyStats[] };
  },
  ["getWebhookLatency"],
  {
    revalidate: 60 * 60, // 1 hour
  },
);

const cached_getInsightChainUsage = unstable_cache(
  async (
    params: AnalyticsQueryParams,
    authToken: string,
  ): Promise<{ data: InsightChainStats[] } | { errorMessage: string }> => {
    const searchParams = buildSearchParams(params);

    const res = await fetchAnalytics({
      authToken,
      url: `v2/insight/usage/by-chain?${searchParams.toString()}`,
      init: {
        method: "GET",
      },
    });

    if (res?.status !== 200) {
      const reason = await res?.text();
      const errMsg = `Failed to fetch Insight chain usage: ${res?.status} - ${res.statusText} - ${reason}`;
      console.error(errMsg);
      return { errorMessage: errMsg };
    }

    const json = await res.json();
    return { data: json.data as InsightChainStats[] };
  },
  ["getInsightChainUsage"],
  {
    revalidate: 60 * 60, // 1 hour
  },
);

export function getInsightChainUsage(
  params: AnalyticsQueryParams,
  authToken: string,
) {
  return cached_getInsightChainUsage(normalizedParams(params), authToken);
}

const cached_getInsightStatusCodeUsage = unstable_cache(
  async (
    params: AnalyticsQueryParams,
    authToken: string,
  ): Promise<{ data: InsightStatusCodeStats[] } | { errorMessage: string }> => {
    const searchParams = buildSearchParams(params);

    const res = await fetchAnalytics({
      authToken,
      url: `v2/insight/usage/by-status-code?${searchParams.toString()}`,
      init: {
        method: "GET",
      },
    });

    if (res?.status !== 200) {
      const reason = await res?.text();
      const errMsg = `Failed to fetch Insight status code usage: ${res?.status} - ${res.statusText} - ${reason}`;
      console.error(errMsg);
      return { errorMessage: errMsg };
    }

    const json = await res.json();
    return { data: json.data as InsightStatusCodeStats[] };
  },
  ["getInsightStatusCodeUsage"],
  {
    revalidate: 60 * 60, // 1 hour
  },
);

export function getInsightStatusCodeUsage(
  params: AnalyticsQueryParams,
  authToken: string,
) {
  return cached_getInsightStatusCodeUsage(normalizedParams(params), authToken);
}

const cached_getInsightEndpointUsage = unstable_cache(
  async (
    params: AnalyticsQueryParams,
    authToken: string,
  ): Promise<{ data: InsightEndpointStats[] } | { errorMessage: string }> => {
    const searchParams = buildSearchParams(params);

    const res = await fetchAnalytics({
      authToken,
      url: `v2/insight/usage/by-endpoint?${searchParams.toString()}`,
      init: {
        method: "GET",
      },
    });

    if (res?.status !== 200) {
      const reason = await res?.text();
      const errMsg = `Failed to fetch Insight endpoint usage: ${res?.status} - ${res.statusText} - ${reason}`;
      console.error(errMsg);
      return { errorMessage: errMsg };
    }

    const json = await res.json();
    return { data: json.data as InsightEndpointStats[] };
  },
  ["getInsightEndpointUsage"],
  {
    revalidate: 60 * 60, // 1 hour
  },
);

export function getInsightEndpointUsage(
  params: AnalyticsQueryParams,
  authToken: string,
) {
  return cached_getInsightEndpointUsage(normalizedParams(params), authToken);
}

const cached_getInsightUsage = unstable_cache(
  async (
    params: AnalyticsQueryParams,
    authToken: string,
  ): Promise<{ data: InsightUsageStats[] } | { errorMessage: string }> => {
    const searchParams = buildSearchParams(params);

    const res = await fetchAnalytics({
      authToken,
      url: `v2/insight/usage?${searchParams.toString()}`,
      init: {
        method: "GET",
      },
    });

    if (res?.status !== 200) {
      const reason = await res?.text();
      const errMsg = `Failed to fetch Insight usage: ${res?.status} - ${res.statusText} - ${reason}`;
      console.error(errMsg);
      return { errorMessage: errMsg };
    }

    const json = await res.json();
    return { data: json.data as InsightUsageStats[] };
  },
  ["getInsightUsage"],
  {
    revalidate: 60 * 60, // 1 hour
  },
);

export function getInsightUsage(
  params: AnalyticsQueryParams,
  authToken: string,
) {
  return cached_getInsightUsage(normalizedParams(params), authToken);
}
