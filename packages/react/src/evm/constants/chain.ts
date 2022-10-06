import { NATIVE_TOKENS, SUPPORTED_CHAIN_ID } from "@thirdweb-dev/sdk";
import { ChainId } from "@thirdweb-dev/sdk";
import type { Chain as WagmiChain } from "wagmi";

export type Chain = WagmiChain & { deprecated?: boolean };
const chain: Record<string, Chain> = {
  mainnet: {
    id: ChainId.Mainnet,
    name: "Ethereum Mainnet",
    nativeCurrency: NATIVE_TOKENS[ChainId.Mainnet],
    rpcUrls: ["https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"],
    blockExplorers: [
      {
        name: "Etherscan",
        url: "https://etherscan.io",
      },
    ],
  },

  goerli: {
    id: ChainId.Goerli,
    name: "Goerli",
    nativeCurrency: NATIVE_TOKENS[ChainId.Goerli],
    rpcUrls: ["https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"],
    blockExplorers: [
      {
        name: "Etherscan",
        url: "https://goerli.etherscan.io",
      },
    ],
    testnet: true,
  },
  polygonMainnet: {
    id: ChainId.Polygon,
    name: "Polygon Mainnet",
    nativeCurrency: NATIVE_TOKENS[ChainId.Polygon],
    rpcUrls: [
      "https://polygon-rpc.com",
      "https://rpc-mainnet.matic.network",
      "https://matic-mainnet.chainstacklabs.com",
      "https://rpc-mainnet.maticvigil.com",
      "https://rpc-mainnet.matic.quiknode.pro",
      "https://matic-mainnet-full-rpc.bwarelabs.com",
    ],
    blockExplorers: [
      {
        name: "Polygonscan",
        url: "https://polygonscan.com",
      },
    ],
  },
  polygonTestnetMumbai: {
    id: ChainId.Mumbai,
    name: "Mumbai",
    nativeCurrency: NATIVE_TOKENS[ChainId.Mumbai],
    rpcUrls: [
      "https://matic-mumbai.chainstacklabs.com",
      "https://rpc-mumbai.maticvigil.com",
      "https://matic-testnet-archive-rpc.bwarelabs.com",
    ],
    blockExplorers: [
      {
        name: "PolygonScan",
        url: "https://mumbai.polygonscan.com",
      },
    ],
    testnet: true,
  },
  avalanche: {
    id: ChainId.Avalanche,
    name: "Avalanche",
    nativeCurrency: NATIVE_TOKENS[ChainId.Avalanche],
    rpcUrls: [
      "https://api.avax.network/ext/bc/C/rpc",
      "https://rpc.ankr.com/avalanche",
    ],
    blockExplorers: [
      {
        name: "SnowTrace",
        url: "https://snowtrace.io/",
      },
    ],
    testnet: false,
  },
  avalancheFujiTestnet: {
    id: ChainId.AvalancheFujiTestnet,
    name: "Avalanche Fuji Testnet",
    nativeCurrency: NATIVE_TOKENS[ChainId.AvalancheFujiTestnet],
    rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
    blockExplorers: [
      {
        name: "SnowTrace",
        url: "https://testnet.snowtrace.io/",
      },
    ],
    testnet: true,
  },
  fantom: {
    id: ChainId.Fantom,
    name: "Fantom Opera",
    nativeCurrency: NATIVE_TOKENS[ChainId.Fantom],
    rpcUrls: ["https://rpc.ftm.tools"],
    blockExplorers: [
      {
        name: "FTMscan",
        url: "https://ftmscan.com/",
      },
    ],
    testnet: false,
  },
  fantomTestnet: {
    id: ChainId.FantomTestnet,
    name: "Fantom Testnet",
    nativeCurrency: NATIVE_TOKENS[ChainId.FantomTestnet],
    rpcUrls: ["https://rpc.testnet.fantom.network"],
    blockExplorers: [
      {
        name: "FTMscan",
        url: "https://testnet.ftmscan.com/",
      },
    ],
    testnet: true,
  },
  optimism: {
    id: ChainId.Optimism,
    name: "Optimism",
    nativeCurrency: NATIVE_TOKENS[ChainId.Optimism],
    rpcUrls: ["https://mainnet.optimism.io"],
    blockExplorers: [
      {
        name: "Etherscan",
        url: "https://optimistic.etherscan.io/",
      },
    ],
    testnet: false,
  },

  optimismGoerli: {
    id: ChainId.OptimismGoerli,
    name: "Optimism Goerli Testnet",
    nativeCurrency: NATIVE_TOKENS[ChainId.OptimismGoerli],
    rpcUrls: ["https://goerli.optimism.io/"],
    blockExplorers: [
      {
        name: "Etherscan",
        url: "https://goerli-optimism.etherscan.io/",
      },
    ],
    testnet: true,
  },
  arbitrum: {
    id: ChainId.Arbitrum,
    name: "Arbitrum One",
    nativeCurrency: NATIVE_TOKENS[ChainId.Arbitrum],
    rpcUrls: ["https://arb1.arbitrum.io/rpc"],
    blockExplorers: [
      {
        name: "Arbiscan",
        url: "https://arbiscan.io/",
      },
    ],
    testnet: false,
  },

  arbitrumGoerli: {
    id: ChainId.ArbitrumGoerli,
    name: "Arbitrum Goerli",
    nativeCurrency: NATIVE_TOKENS[ChainId.ArbitrumGoerli],
    rpcUrls: ["https://goerli-rollup.arbitrum.io/rpc/"],
    blockExplorers: [
      {
        name: "Arbitrum Goerli Rollup Explorer",
        url: "https://goerli-rollup-explorer.arbitrum.io",
      },
    ],
    testnet: true,
  },
  binanceSmartChainMainnet: {
    id: ChainId.BinanceSmartChainMainnet,
    name: "Binance Smart Chain Mainnet",
    nativeCurrency: NATIVE_TOKENS[ChainId.BinanceSmartChainMainnet],
    rpcUrls: ["https://bsc-dataseed1.binance.org"],
    blockExplorers: [
      {
        name: "BscScan",
        url: "https://bscscan.com/",
      },
    ],
    testnet: false,
  },
  binanceSmartChainTestnet: {
    id: ChainId.BinanceSmartChainTestnet,
    name: "Binance Smart Chain Testnet",
    nativeCurrency: NATIVE_TOKENS[ChainId.BinanceSmartChainTestnet],
    rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545"],
    blockExplorers: [
      {
        name: "BscScan",
        url: "https://testnet.bscscan.com/",
      },
    ],
    testnet: true,
  },
};

export const defaultSupportedChains = Object.values(chain) as Chain[];

export type SupportedChainId = typeof defaultSupportedChains[number]["id"];

export type SupportedChain = SupportedChainId | Chain;

export function getChainFromChainId(chainId: SUPPORTED_CHAIN_ID) {
  return defaultSupportedChains.find((c) => c.id === chainId) as Chain;
}
