import { fetchAnalytics } from "data/analytics/fetch-analytics";
import type {
  AnalyticsQueryParams,
  AnalyticsQueryParamsV2,
  InAppWalletStats,
  RpcMethodStats,
  TransactionStats,
  UserOpStats,
  WalletStats,
  WalletUserStats,
} from "types/analytics";
import { getChains } from "./chain";

function buildSearchParams(
  params: AnalyticsQueryParams | AnalyticsQueryParamsV2,
): URLSearchParams {
  const searchParams = new URLSearchParams();

  // v1 params
  if ("clientId" in params && params.clientId) {
    searchParams.append("clientId", params.clientId);
  }
  if ("accountId" in params && params.accountId) {
    searchParams.append("accountId", params.accountId);
  }

  // v2 params
  if ("teamId" in params && params.teamId) {
    searchParams.append("teamId", params.teamId);
  }
  if ("projectId" in params && params.projectId) {
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
  params: AnalyticsQueryParamsV2,
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
  params: AnalyticsQueryParamsV2,
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
  params: AnalyticsQueryParamsV2,
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
  params: Omit<AnalyticsQueryParamsV2, "period">,
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
  params: AnalyticsQueryParamsV2,
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
    `v1/rpc/evm-methods?${searchParams.toString()}`,
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
    `v1/wallets/users?${searchParams.toString()}`,
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

export async function isProjectActive(
  params: AnalyticsQueryParams,
): Promise<boolean> {
  const searchParams = buildSearchParams(params);
  const res = await fetchAnalytics(`v1/active?${searchParams.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (res?.status !== 200) {
    const reason = await res?.text();
    console.error(
      `Failed to fetch project active status: ${res?.status} - ${res.statusText} - ${reason}`,
    );
    return false;
  }

  const json = await res.json();
  return json.data.isActive as boolean;
}
