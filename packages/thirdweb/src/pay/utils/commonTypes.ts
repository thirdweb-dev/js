export type PayTokenInfo = {
  chainId: number;
  tokenAddress: string;
  decimals: number;
  priceUSDCents: number;
  name?: string;
  symbol?: string;
};

export type PayOnChainTransactionDetails = {
  transactionHash: string;
  token: PayTokenInfo;
  amountWei: string;
  amount: string;
  amountUSDCents: number;
  completedAt?: string; // ISO DATE
  explorerLink?: string;
};

export type FiatProvider = (typeof FiatProviders)[number];

export const FiatProviders = ["COINBASE", "STRIPE", "TRANSAK", "KADO"] as const;
