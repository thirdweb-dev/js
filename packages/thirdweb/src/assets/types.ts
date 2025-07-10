import type { FileOrBufferOrString } from "../storage/upload/types.js";
import type { ClientAndChainAndAccount } from "../utils/types.js";

export type TokenParams = {
  name: string;
  description?: string;
  image?: FileOrBufferOrString;
  external_link?: string;
  social_urls?: Record<string, string>;
  symbol?: string;
  contractURI?: string;
  maxSupply: bigint;
  owner?: string;
};

export type PoolConfig = {
  amount: bigint;
  currency?: string;
  initialTick?: number;
  referrerRewardBps?: number;
};

export type MarketConfig = {
  tokenOut?: string;
  pricePerUnit: bigint;
  priceDenominator?: number;
  startTime?: number;
  endTime?: number;
  hookAddress?: string;
  hookInitData?: string;
};

export type DistributeContent = {
  amount: bigint;
  recipient: string;
};

type DistributeConfig = {
  content: DistributeContent[];
};

type LaunchConfig =
  | { kind: "pool"; config: PoolConfig }
  | { kind: "market"; config: MarketConfig }
  | { kind: "distribute"; config: DistributeConfig };

export type CreateTokenOptions = ClientAndChainAndAccount & {
  salt?: string;
  params: TokenParams;
  launchConfig?: LaunchConfig;
  referrerAddress?: string;
};
