import { fetchAnalytics } from "data/analytics/fetch-analytics";
import type {
  AnalyticsQueryParams,
  InAppWalletStats,
  RpcMethodStats,
  UserOpStats,
  WalletStats,
  WalletUserStats,
} from "types/analytics";

function buildSearchParams(params: AnalyticsQueryParams): URLSearchParams {
  const searchParams = new URLSearchParams();
  if (params.clientId) {
    searchParams.append("clientId", params.clientId);
  }
  if (params.accountId) {
    searchParams.append("accountId", params.accountId);
  }
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
  const res = await fetchAnalytics(`v1/wallets?${searchParams.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (res?.status !== 200) {
    console.error("Failed to fetch wallet connections");
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
    `v1/wallets/in-app?${searchParams.toString()}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    },
  );

  if (res?.status !== 200) {
    console.error("Failed to fetch in-app wallet usage");
    return [];
  }

  const json = await res.json();
  return json.data as InAppWalletStats[];
}

export async function getUserOpUsage(
  params: AnalyticsQueryParams,
): Promise<UserOpStats[]> {
  const searchParams = buildSearchParams(params);
  const res = await fetchAnalytics(`v1/user-ops?${searchParams.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (res?.status !== 200) {
    console.error("Failed to fetch user ops usage");
    return [];
  }

  const json = await res.json();
  return json.data as UserOpStats[];
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
    console.error("Failed to fetch wallet user stats");
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
    console.error("Failed to fetch project active status");
    return false;
  }

  const json = await res.json();
  return json.data.isActive as boolean;
}
