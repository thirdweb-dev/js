import type { Prettify } from "../utils/type-utils.js";

export type Chain = Prettify<Readonly<ChainOptions & { rpc: string }>>;

export type ChainOptions = {
  id: number;
  name?: string;
  rpc?: string;
  nativeCurrency?: {
    name?: string;
    symbol?: string;
    decimals?: number;
  };
  blockExplorers?: Array<{
    name: string;
    url: string;
    apiUrl?: string;
  }>;
  testnet?: true;
  experimental?: {
    increaseZeroByteCount?: boolean;
  };
};

type Icon = {
  url: string;
  width: number;
  height: number;
  format: string;
};

type ChainExplorer = {
  name: string;
  url: string;
  icon?: Icon;
  standard: string;
};

export type ChainMetadata = {
  name: string;
  title?: string;
  chain: string;
  icon?: Icon;
  rpc: readonly string[];
  features?: Readonly<Array<{ name: string }>>;
  faucets?: readonly string[];
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  infoURL?: string;
  shortName: string;
  chainId: number;
  networkId?: number;
  ens?: {
    registry: string;
  };
  explorers?: Readonly<Array<ChainExplorer>>;
  testnet: boolean;
  slug: string;
  slip44?: number;
  status?: string;
  redFlags?: readonly string[];
  parent?: {
    chain: string;
    type: string;
    bridges?: Readonly<Array<{ url: string }>>;
  };
};

// legacy chain type
export type LegacyChain = {
  name: string;
  title?: string;
  chain: string;
  icon?: Icon;
  rpc: readonly string[];
  features?: Readonly<Array<{ name: string }>>;
  faucets?: readonly string[];
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  infoURL?: string;
  shortName: string;
  chainId: number;
  networkId?: number;
  ens?: {
    registry: string;
  };
  explorers?: Readonly<Array<ChainExplorer>>;
  testnet: boolean;
  slug: string;
  slip44?: number;
  status?: string;
  redFlags?: readonly string[];
  parent?: {
    chain: string;
    type: string;
    bridges?: Readonly<Array<{ url: string }>>;
  };
};
