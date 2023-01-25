export type Chain = {
  name: string;
  chain: string;
  icon?: {
    url: string;
    width: number;
    height: number;
    format: string;
  };
  rpc: string[];
  features?: Array<{ name: string }>;
  faucets?: string[];
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: 18;
  };
  infoURL?: string;
  shortName: string;
  chainId: number;
  networkId?: number;
  ens?: {
    registry: string;
  };
  explorers?: Array<{
    name: string;
    url: string;
    standard: string;
  }>;
  testnet: boolean;
  slug: string;
};
