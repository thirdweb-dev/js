import { fetchAnalytics } from "data/analytics/fetch-analytics";

export interface WalletStats {
  date: string;
  uniqueWalletsConnected: number;
  totalConnections: number;
  walletType: string;
}

export interface WalletUserStats {
  date: string;
  newUsers: number;
  returningUsers: number;
  totalUsers: number;
}

export interface InAppWalletStats {
  date: string;
  authenticationMethod: string;
  uniqueWalletsConnected: number;
}

export interface EcosystemWalletStats extends InAppWalletStats { }

export interface UserOpStats {
  date: string;
  successful: number;
  failed: number;
  sponsoredUsd: number;
  chainId?: string;
}

export interface RpcMethodStats {
  date: string;
  evmMethod: string;
  count: number;
}

export interface AnalyticsQueryParams {
  clientId?: string;
  accountId?: string;
  from?: Date;
  to?: Date;
  period?: "day" | "week" | "month" | "year" | "all";
}

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
