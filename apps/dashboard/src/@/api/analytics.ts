import "server-only";

import type {
  AnalyticsQueryParams,
  EcosystemWalletStats,
  InAppWalletStats,
  RpcMethodStats,
  TransactionStats,
  UserOpStats,
  WalletStats,
  WalletUserStats,
} from "types/analytics";
import { getAuthToken } from "../../app/api/lib/getAuthToken";
import { getChains } from "./chain";

async function fetchAnalytics(
  input: string | URL,
  init?: RequestInit,
): Promise<Response> {
  const token = await getAuthToken();

  if (!token) {
    throw new Error("You are not authorized to perform this action");
  }

  const [pathname, searchParams] = input.toString().split("?");
  if (!pathname) {
    throw new Error("Invalid input, no pathname provided");
  }

  // create a new URL object for the analytics server
  const ANALYTICS_SERVICE_URL = new URL(
    process.env.ANALYTICS_SERVICE_URL || "https://analytics.thirdweb.com",
  );
  ANALYTICS_SERVICE_URL.pathname = pathname;
  for (const param of searchParams?.split("&") || []) {
    const [key, value] = param.split("=");
    if (!key || !value) {
      throw new Error("Invalid input, no key or value provided");
    }
    ANALYTICS_SERVICE_URL.searchParams.append(
      decodeURIComponent(key),
      decodeURIComponent(value),
    );
  }
  // client id DEBUG OVERRIDE
  // ANALYTICS_SERVICE_URL.searchParams.delete("clientId");
  // ANALYTICS_SERVICE_URL.searchParams.delete("accountId");
  // ANALYTICS_SERVICE_URL.searchParams.append(
  //   "clientId",
  //   "...",
  // );

  return fetch(ANALYTICS_SERVICE_URL, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...init?.headers,
      authorization: `Bearer ${token}`,
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
  return searchParams;
}

export async function getWalletConnections(
  params: AnalyticsQueryParams,
): Promise<WalletStats[]> {
  const searchParams = buildSearchParams(params);
  const res = await fetchAnalytics(
    `v2/sdk/wallet-connects?${searchParams.toString()}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    },
  );

  if (res?.status !== 200) {
    const reason = await res?.text();
    console.error(
      `Failed to fetch wallet connections, ${res?.status} - ${res.statusText} - ${reason}`,
    );
    return [];
  }

  const json = await res.json();
  return json.data as WalletStats[];
}

export async function getInAppWalletUsage(
  params: AnalyticsQueryParams,
): Promise<InAppWalletStats[]> {
  const searchParams = buildSearchParams(params);
  const res = await fetchAnalytics(
    `v2/wallet/connects?${searchParams.toString()}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    },
  );

  if (res?.status !== 200) {
    const reason = await res?.text();
    console.error(
      `Failed to fetch in-app wallet usage, ${res?.status} - ${res.statusText} - ${reason}`,
    );
    return [];
  }

  const json = await res.json();
  return json.data as InAppWalletStats[];
}

export async function getUserOpUsage(
  params: AnalyticsQueryParams,
): Promise<UserOpStats[]> {
  const searchParams = buildSearchParams(params);
  const res = await fetchAnalytics(
    `v2/bundler/usage?${searchParams.toString()}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    },
  );

  if (res?.status !== 200) {
    const reason = await res?.text();
    console.error(
      `Failed to fetch user ops usage: ${res?.status} - ${res.statusText} - ${reason}`,
    );
    return [];
  }

  const json = await res.json();
  return json.data as UserOpStats[];
}

export async function getAggregateUserOpUsage(
  params: Omit<AnalyticsQueryParams, "period">,
): Promise<UserOpStats> {
  const [userOpStats, chains] = await Promise.all([
    getUserOpUsage({ ...params, period: "all" }),
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
      successful: 0,
      failed: 0,
      sponsoredUsd: 0,
    },
  );
}

export async function getClientTransactions(
  params: AnalyticsQueryParams,
): Promise<TransactionStats[]> {
  const searchParams = buildSearchParams(params);
  const res = await fetchAnalytics(
    `v2/sdk/contract-transactions?${searchParams.toString()}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    },
  );

  if (res?.status !== 200) {
    const reason = await res?.text();
    console.error(
      `Failed to fetch client transactions stats: ${res?.status} - ${res.statusText} - ${reason}`,
    );
    return [];
  }

  const json = await res.json();
  return json.data as TransactionStats[];
}

export async function getRpcMethodUsage(
  params: AnalyticsQueryParams,
): Promise<RpcMethodStats[]> {
  const searchParams = buildSearchParams(params);
  const res = await fetchAnalytics(
    `v2/rpc/evm-methods?${searchParams.toString()}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    },
  );

  if (res?.status !== 200) {
    console.error("Failed to fetch RPC method usage");
    return [];
  }

  const json = await res.json();
  return json.data as RpcMethodStats[];
}

export async function getWalletUsers(
  params: AnalyticsQueryParams,
): Promise<WalletUserStats[]> {
  const searchParams = buildSearchParams(params);
  const res = await fetchAnalytics(
    `v2/sdk/wallet-connects/users?${searchParams.toString()}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    },
  );

  if (res?.status !== 200) {
    const reason = await res?.text();
    console.error(
      `Failed to fetch wallet user stats: ${res?.status} - ${res.statusText} - ${reason}`,
    );
    return [];
  }

  const json = await res.json();
  return json.data as WalletUserStats[];
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

export async function isProjectActive(params: {
  teamId: string;
  projectId: string;
}): Promise<ActiveStatus> {
  const searchParams = buildSearchParams(params);
  const res = await fetchAnalytics(
    `v2/active-usage?${searchParams.toString()}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    },
  );

  if (res?.status !== 200) {
    const reason = await res?.text();
    console.error(
      `Failed to fetch project active status: ${res?.status} - ${res.statusText} - ${reason}`,
    );
    return {
      bundler: false,
      storage: false,
      rpc: false,
      nebula: false,
      sdk: false,
      insight: false,
      pay: false,
      inAppWallet: false,
      ecosystemWallet: false,
    } as ActiveStatus;
  }

  const json = await res.json();
  return json.data as ActiveStatus;
}

export async function getEcosystemWalletUsage(args: {
  teamId: string;
  ecosystemSlug: string;
  ecosystemPartnerId?: string;
  projectId?: string;
  from?: Date;
  to?: Date;
  period?: "day" | "week" | "month" | "year" | "all";
}) {
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
  const res = await fetchAnalytics(
    `v2/wallet/connects?${searchParams.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (res?.status !== 200) {
    const reason = await res?.text();
    console.error(
      `Failed to fetch ecosystem wallet stats: ${res?.status} - ${res.statusText} - ${reason}`,
    );
    return null;
  }

  const json = await res.json();

  return json.data as EcosystemWalletStats[];
}
