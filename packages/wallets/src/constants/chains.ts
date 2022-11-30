import {
  Chain,
  etherscanBlockExplorers,
  alchemyRpcUrls,
  infuraRpcUrls,
} from "@wagmi/core";

/**
 * @public
 */
export enum ChainId {
  Mainnet = 1,
  Goerli = 5,
  Polygon = 137,
  Mumbai = 80001,
  Fantom = 250,
  FantomTestnet = 4002,
  Avalanche = 43114,
  AvalancheFujiTestnet = 43113,
  Optimism = 10,
  OptimismGoerli = 420,
  Arbitrum = 42161,
  ArbitrumGoerli = 421613,
  BinanceSmartChainMainnet = 56,
  BinanceSmartChainTestnet = 97,
}

/**
 * @public
 */
export type SUPPORTED_CHAIN_ID =
  | ChainId.Mainnet
  | ChainId.Goerli
  | ChainId.Mumbai
  | ChainId.Polygon
  | ChainId.Fantom
  | ChainId.FantomTestnet
  | ChainId.Avalanche
  | ChainId.AvalancheFujiTestnet
  | ChainId.Optimism
  | ChainId.OptimismGoerli
  | ChainId.Arbitrum
  | ChainId.ArbitrumGoerli
  | ChainId.BinanceSmartChainMainnet
  | ChainId.BinanceSmartChainTestnet;

/**
 * @public
 */
export const SUPPORTED_CHAIN_IDS: SUPPORTED_CHAIN_ID[] = [
  ChainId.Mainnet,
  ChainId.Goerli,
  ChainId.Polygon,
  ChainId.Mumbai,
  ChainId.Fantom,
  ChainId.FantomTestnet,
  ChainId.Avalanche,
  ChainId.AvalancheFujiTestnet,
  ChainId.Optimism,
  ChainId.OptimismGoerli,
  ChainId.Arbitrum,
  ChainId.ArbitrumGoerli,
  ChainId.BinanceSmartChainMainnet,
  ChainId.BinanceSmartChainTestnet,
];

type NativeCurrency = {
  name: string;
  /** 2-6 characters long */
  symbol: string;
  decimals: 18;
};

/**
 * @public
 */
export const NATIVE_TOKEN_ADDRESS =
  "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

/**
 * @public
 */
export const NATIVE_TOKENS: Record<SUPPORTED_CHAIN_ID, NativeCurrency> = {
  [ChainId.Mainnet]: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  [ChainId.Goerli]: {
    name: "Görli Ether",
    symbol: "GOR",
    decimals: 18,
  },
  [ChainId.Polygon]: {
    name: "Matic",
    symbol: "MATIC",
    decimals: 18,
  },
  [ChainId.Mumbai]: {
    name: "Matic",
    symbol: "MATIC",
    decimals: 18,
  },
  [ChainId.Avalanche]: {
    name: "Avalanche",
    symbol: "AVAX",
    decimals: 18,
  },
  [ChainId.AvalancheFujiTestnet]: {
    name: "Avalanche",
    symbol: "AVAX",
    decimals: 18,
  },
  [ChainId.Fantom]: {
    name: "Fantom",
    symbol: "FTM",
    decimals: 18,
  },
  [ChainId.FantomTestnet]: {
    name: "Fantom",
    symbol: "FTM",
    decimals: 18,
  },
  [ChainId.Arbitrum]: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },

  [ChainId.ArbitrumGoerli]: {
    name: "Arbitrum Goerli Ether",
    symbol: "AGOR",
    decimals: 18,
  },
  [ChainId.Optimism]: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },

  [ChainId.OptimismGoerli]: {
    name: "Goerli Ether",
    symbol: "ETH",
    decimals: 18,
  },
  [ChainId.BinanceSmartChainMainnet]: {
    name: "Binance Chain Native Token",
    symbol: "BNB",
    decimals: 18,
  },
  [ChainId.BinanceSmartChainTestnet]: {
    name: "Binance Chain Native Token",
    symbol: "TBNB",
    decimals: 18,
  },
};

export const DEFAULT_API_KEY =
  "c6634ad2d97b74baf15ff556016830c251050e6c36b9da508ce3ec80095d3dc1";

export function getRpcUrl(network: string) {
  return `https://${network}.rpc.thirdweb.com/${DEFAULT_API_KEY}`;
}

/**
 * Returns the native token for a given chain
 * @param chainId - the chain id
 * @public
 */
export function getNativeTokenByChainId(chainId: ChainId): NativeCurrency {
  return NATIVE_TOKENS[chainId as SUPPORTED_CHAIN_ID];
}

const supportedChains: Record<SUPPORTED_CHAIN_ID, Chain> = {
  [ChainId.Mainnet]: {
    id: ChainId.Mainnet,
    name: "Ethereum",
    network: "homestead",
    nativeCurrency: getNativeTokenByChainId(ChainId.Mainnet),
    rpcUrls: {
      alchemy: alchemyRpcUrls.mainnet,
      default: getRpcUrl("ethereum"),
      infura: infuraRpcUrls.mainnet,
      public: getRpcUrl("ethereum"),
    },
    blockExplorers: {
      etherscan: etherscanBlockExplorers.mainnet,
      default: etherscanBlockExplorers.mainnet,
    },
  },
  [ChainId.Goerli]: {
    id: ChainId.Goerli,
    name: "Goerli",
    network: "goerli",
    nativeCurrency: getNativeTokenByChainId(ChainId.Goerli),
    rpcUrls: {
      alchemy: alchemyRpcUrls.goerli,
      default: getRpcUrl("goerli"),
      infura: infuraRpcUrls.goerli,
      public: getRpcUrl("goerli"),
    },
    blockExplorers: {
      etherscan: etherscanBlockExplorers.goerli,
      default: etherscanBlockExplorers.goerli,
    },
    testnet: true,
  },
  [ChainId.Polygon]: {
    id: ChainId.Polygon,
    name: "Polygon",
    network: "matic",
    nativeCurrency: getNativeTokenByChainId(ChainId.Polygon),
    rpcUrls: {
      alchemy: alchemyRpcUrls.polygon,
      default: getRpcUrl("polygon"),
      infura: infuraRpcUrls.polygon,
      public: getRpcUrl("polygon"),
    },
    blockExplorers: {
      etherscan: etherscanBlockExplorers.polygon,
      default: etherscanBlockExplorers.polygon,
    },
  },
  [ChainId.Mumbai]: {
    id: ChainId.Mumbai,
    name: "Mumbai",
    network: "maticmum",
    nativeCurrency: getNativeTokenByChainId(ChainId.Mumbai),
    rpcUrls: {
      alchemy: alchemyRpcUrls.polygonMumbai,
      default: getRpcUrl("mumbai"),
      infura: infuraRpcUrls.polygonMumbai,
      public: getRpcUrl("mumbai"),
    },
    blockExplorers: {
      etherscan: etherscanBlockExplorers.polygonMumbai,
      default: etherscanBlockExplorers.polygonMumbai,
    },
    testnet: true,
  },
  [ChainId.Avalanche]: {
    id: ChainId.Avalanche,
    name: "Avalanche",
    network: "avalanche",
    nativeCurrency: getNativeTokenByChainId(ChainId.Avalanche),
    rpcUrls: {
      default: getRpcUrl("avalanche"),
      public: getRpcUrl("avalanche"),
    },
    blockExplorers: {
      default: {
        name: "SnowTrace",
        url: "https://snowtrace.io/",
      },
    },
  },
  [ChainId.AvalancheFujiTestnet]: {
    id: ChainId.AvalancheFujiTestnet,
    name: "Avalanche Fuji Testnet",
    network: "avalanche-fuji",
    nativeCurrency: getNativeTokenByChainId(ChainId.AvalancheFujiTestnet),
    rpcUrls: {
      default: getRpcUrl("avalanche-fuji"),
      public: getRpcUrl("avalanche-fuji"),
    },
    blockExplorers: {
      default: {
        name: "SnowTrace",
        url: "https://testnet.snowtrace.io/",
      },
    },
    testnet: true,
  },
  [ChainId.Fantom]: {
    id: ChainId.Fantom,
    name: "Fantom Opera",
    network: "fantom",
    nativeCurrency: getNativeTokenByChainId(ChainId.Fantom),
    rpcUrls: {
      default: getRpcUrl("fantom"),
      public: getRpcUrl("fantom"),
    },
    blockExplorers: {
      default: {
        name: "Fantom Explorer",
        url: "https://ftmscan.com/",
      },
    },
  },
  [ChainId.FantomTestnet]: {
    id: ChainId.FantomTestnet,
    name: "Fantom Opera Testnet",
    network: "fantom-testnet",
    nativeCurrency: getNativeTokenByChainId(ChainId.FantomTestnet),
    rpcUrls: {
      default: getRpcUrl("fantom-testnet"),
      public: getRpcUrl("fantom-testnet"),
    },
    blockExplorers: {
      default: {
        name: "Fantom Explorer",
        url: "https://testnet.ftmscan.com/",
      },
    },
    testnet: true,
  },
  [ChainId.Optimism]: {
    id: ChainId.Optimism,
    name: "Optimism",
    network: "optimism",
    nativeCurrency: getNativeTokenByChainId(ChainId.Optimism),
    rpcUrls: {
      alchemy: alchemyRpcUrls.optimism,
      default: getRpcUrl("optimism"),
      infura: infuraRpcUrls.optimism,
      public: getRpcUrl("optimism"),
    },
    blockExplorers: {
      etherscan: etherscanBlockExplorers.optimism,
      default: etherscanBlockExplorers.optimism,
    },
  },
  [ChainId.OptimismGoerli]: {
    id: ChainId.OptimismGoerli,
    name: "Optimism Goerli",
    network: "optimism-goerli",
    nativeCurrency: getNativeTokenByChainId(ChainId.OptimismGoerli),
    rpcUrls: {
      alchemy: alchemyRpcUrls.optimismGoerli,
      default: getRpcUrl("optimism-goerli"),
      infura: infuraRpcUrls.optimismGoerli,
      public: getRpcUrl("optimism-goerli"),
    },
    blockExplorers: {
      etherscan: etherscanBlockExplorers.optimismGoerli,
      default: etherscanBlockExplorers.optimismGoerli,
    },
    testnet: true,
  },
  [ChainId.Arbitrum]: {
    id: ChainId.Arbitrum,
    name: "Arbitrum One",
    network: "arbitrum",
    nativeCurrency: getNativeTokenByChainId(ChainId.Arbitrum),
    rpcUrls: {
      alchemy: alchemyRpcUrls.arbitrum,
      default: getRpcUrl("arbitrum"),
      infura: infuraRpcUrls.arbitrum,
      public: getRpcUrl("arbitrum"),
    },
    blockExplorers: {
      etherscan: etherscanBlockExplorers.arbitrum,
      default: etherscanBlockExplorers.arbitrum,
    },
  },
  [ChainId.ArbitrumGoerli]: {
    id: ChainId.ArbitrumGoerli,
    name: "Arbitrum Goerli",
    network: "arbitrum-goerli",
    nativeCurrency: getNativeTokenByChainId(ChainId.ArbitrumGoerli),
    rpcUrls: {
      alchemy: alchemyRpcUrls.arbitrumGoerli,
      default: getRpcUrl("arbitrum-goerli"),
      infura: infuraRpcUrls.arbitrumGoerli,
      public: getRpcUrl("arbitrum-goerli"),
    },
    blockExplorers: {
      etherscan: etherscanBlockExplorers.arbitrumGoerli,
      default: etherscanBlockExplorers.arbitrumGoerli,
    },
    testnet: true,
  },
  [ChainId.BinanceSmartChainMainnet]: {
    id: ChainId.BinanceSmartChainMainnet,
    name: "Binance Smart Chain",
    network: "bsc",
    nativeCurrency: getNativeTokenByChainId(ChainId.BinanceSmartChainMainnet),
    rpcUrls: {
      default: getRpcUrl("binance"),
      public: getRpcUrl("binance"),
    },
    blockExplorers: {
      default: {
        name: "BscScan",
        url: "https://bscscan.com/",
      },
    },
  },
  [ChainId.BinanceSmartChainTestnet]: {
    id: ChainId.BinanceSmartChainTestnet,
    name: "Binance Smart Chain Testnet",
    network: "bsc-testnet",
    nativeCurrency: getNativeTokenByChainId(ChainId.BinanceSmartChainTestnet),
    rpcUrls: {
      default: getRpcUrl("binance-testnet"),
      public: getRpcUrl("binance-testnet"),
    },
    blockExplorers: {
      default: {
        name: "BscScan",
        url: "https://testnet.bscscan.com/",
      },
    },
    testnet: true,
  },
};

export const thirdwebChains: Chain[] = Object.values(supportedChains);
