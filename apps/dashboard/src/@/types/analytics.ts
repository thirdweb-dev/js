import type { Address } from "thirdweb";

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

export interface EcosystemWalletStats extends InAppWalletStats {
  ecosystemPartnerId: string;
}

export interface UserOpStats {
  date: string;
  successful: number;
  failed: number;
  sponsoredUsd: number;
  chainId?: string;
}

export interface TransactionStats {
  date: string;
  chainId: number;
  contractAddress?: string;
  count: number;
}

export interface RpcMethodStats {
  date: string;
  evmMethod: string;
  count: number;
}

export interface EngineCloudStats {
  date: string;
  chainId: string;
  pathname: string;
  totalRequests: number;
}

export interface UniversalBridgeStats {
  date: string;
  chainId: number;
  status: "completed" | "failed";
  type: "onchain" | "onramp";
  count: number;
  amountUsdCents: number;
  developerFeeUsdCents: number;
}

export interface UniversalBridgeWalletStats {
  date: string;
  chainId: number;
  walletAddress: Address;
  type: "onchain" | "onramp";
  count: number;
  amountUsdCents: number;
  developerFeeUsdCents: number;
}

export interface AnalyticsQueryParams {
  teamId: string;
  projectId?: string;
  from?: Date;
  to?: Date;
  period?: "day" | "week" | "month" | "year" | "all";
}

export interface WebhookRequestStats {
  date: string;
  webhookId: string;
  httpStatusCode: number;
  totalRequests: number;
}

export interface WebhookLatencyStats {
  date: string;
  webhookId: string;
  p50LatencyMs: number;
  p90LatencyMs: number;
  p99LatencyMs: number;
}

export interface WebhookSummaryStats {
  webhookId: string;
  totalRequests: number;
  successRequests: number;
  errorRequests: number;
  successRate: number;
  avgLatencyMs: number;
  errorBreakdown: Record<string, number>;
}
