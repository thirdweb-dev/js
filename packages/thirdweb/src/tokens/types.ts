import type { Hex } from "viem";
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
  developerRewardBps?: number;
};

export type DistributeContent = {
  amount: string;
  recipient: string;
};

type DistributeConfig = {
  content: DistributeContent[];
};

type LaunchConfig =
  | { kind: "none"; config: undefined }
  | { kind: "pool"; config: PoolConfig }
  | { kind: "distribute"; config: DistributeConfig };

export type CreateTokenOptions = ClientAndChainAndAccount & {
  salt?: Hex;
  params: TokenParams;
  launchConfig?: LaunchConfig;
  developerAddress?: string;
};

export type CreateTokenByImplementationConfigOptions =
  ClientAndChainAndAccount &
    CreateTokenOptions & {
      implementationAddress: string;
    };
