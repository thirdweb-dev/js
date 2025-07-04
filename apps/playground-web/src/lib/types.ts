export type TokenMetadata = {
  name: string;
  symbol: string;
  address: string;
  decimals: number;
  chainId: number;
  iconUri?: string;
};

export type ChainMetadata = {
  chainId: number;
  name: string;
  slug: string;
  icon?: {
    url: string;
  };
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpc: string[];
  testnet: boolean;
  faucets?: string[];
  explorers?: Array<{
    name: string;
    url: string;
    icon?: {
      url: string;
    };
  }>;
};
