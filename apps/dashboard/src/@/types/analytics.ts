import type { Address } from "thirdweb";

export interface WalletStats {
  date: string;
  uniqueWalletsConnected: number;
  totalConnections: number;
  walletType: string;
}

export type WalletStatsWithName = WalletStats & {
  walletName: string;
};

export interface InAppWalletStats {
  date: string;
  authenticationMethod: string;
  uniqueWalletsConnected: number;
  newUsers: number;
}

export interface EcosystemWalletStats extends InAppWalletStats {
  ecosystemPartnerId: string;
}

export interface UserOpStats {
  date: string;
  successful: number;
  failed: number;
  sponsoredUsd: number;
  gasUnits: number;
  avgGasPrice: number;
  chainId?: string;
}

export interface TransactionStats {
  date: string;
  chainId: number;
  contractAddress?: string;
  count: number;
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

export interface AIUsageStats {
  date: string;
  totalPromptTokens: number;
  totalCompletionTokens: number;
  totalSessions: number;
  totalRequests: number;
}

export interface AnalyticsQueryParams {
  teamId: string;
  projectId?: string;
  from?: Date;
  to?: Date;
  period?: "day" | "week" | "month" | "year" | "all";
  limit?: number;
}

export interface X402SettlementsOverall {
  date: string;
  totalRequests: number;
  totalValue: number;
  totalValueUSD: number;
}

export interface X402SettlementsByChainId extends X402SettlementsOverall {
  chainId: string;
}

export interface X402SettlementsByPayer extends X402SettlementsOverall {
  payer: string;
}

interface X402SettlementsByReceiver extends X402SettlementsOverall {
  receiver: string;
}

export interface X402SettlementsByResource extends X402SettlementsOverall {
  resource: string;
}

interface X402SettlementsByAsset {
  date: string;
  asset: string;
  totalRequests: number;
  totalValue: number;
  totalValueUSD: number;
}

export type X402SettlementStats =
  | X402SettlementsOverall
  | X402SettlementsByChainId
  | X402SettlementsByPayer
  | X402SettlementsByReceiver
  | X402SettlementsByResource
  | X402SettlementsByAsset;

export interface X402QueryParams extends AnalyticsQueryParams {
  groupBy?: "overall" | "chainId" | "payer" | "resource" | "asset" | "receiver";
}
