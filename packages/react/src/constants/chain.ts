import { NATIVE_TOKENS, SUPPORTED_CHAIN_ID } from "@thirdweb-dev/sdk";
import { ChainId } from "@thirdweb-dev/sdk";
import type { Chain as WagmiChain } from "wagmi";

export type Chain = WagmiChain;
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
  rinkeby: {
    id: ChainId.Rinkeby,
    name: "Rinkeby",
    nativeCurrency: NATIVE_TOKENS[ChainId.Rinkeby],
    rpcUrls: ["https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"],
    blockExplorers: [
      {
        name: "Etherscan",
        url: "https://rinkeby.etherscan.io",
      },
    ],
    testnet: true,
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
  optimismTestnet: {
    id: ChainId.OptimismTestnet,
    name: "Optimism Kovan",
    nativeCurrency: NATIVE_TOKENS[ChainId.OptimismTestnet],
    rpcUrls: ["https://kovan.optimism.io"],
    blockExplorers: [
      {
        name: "Etherscan",
        url: "https://kovan-optimistic.etherscan.io/",
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
  arbitrumTestnet: {
    id: ChainId.ArbitrumTestnet,
    name: "Arbitrum Rinkeby",
    nativeCurrency: NATIVE_TOKENS[ChainId.ArbitrumTestnet],
    rpcUrls: ["https://rinkeby.arbitrum.io/rpc"],
    blockExplorers: [
      {
        name: "Arbiscan",
        url: "https://testnet.arbiscan.io/",
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
