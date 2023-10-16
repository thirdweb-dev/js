type Icon = {
  url: string;
  width: number;
  height: number;
  format: string;
};

export type ChainExplorer = {
  name: string;
  url: string;
  icon?: Icon;
  standard: string;
};

export type Chain = {
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
  chainId: number | string;
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

export type ApiChain = Omit<Chain, "features"> & {
  features: string[];
};

// MinimalChain is a subset of Chain with only the fields that are required / non-optional
export type MinimalChain = Pick<
  Chain,
  | "name"
  | "chain"
  | "rpc"
  | "nativeCurrency"
  | "shortName"
  | "chainId"
  | "testnet"
  | "slug"
  | "icon"
>;
