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

export interface EcosystemWalletStats extends InAppWalletStats {}

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

export interface AnalyticsQueryParams {
  clientId?: string;
  accountId?: string;
  from?: Date;
  to?: Date;
  period?: "day" | "week" | "month" | "year" | "all";
}
