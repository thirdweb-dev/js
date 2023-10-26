export const ChainToPublicRpc: Record<Chain, string> = {
  Ethereum: "https://ethereum.rpc.thirdweb.com",
  Goerli: "https://goerli.rpc.thirdweb.com",
  Mumbai: "https://mumbai.rpc.thirdweb.com",
  Polygon: "https://polygon.rpc.thirdweb.com",
  Avalanche: "https://avalanche.rpc.thirdweb.com",
  Optimism: "https://optimism.rpc.thirdweb.com",
  OptimismGoerli: "https://optimism-goerli.rpc.thirdweb.com",
  BSC: "https://binance.rpc.thirdweb.com",
  BSCTestnet: "https://binance-testnet.rpc.thirdweb.com",
  ArbitrumOne: "https://arbitrum.rpc.thirdweb.com",
  ArbitrumGoerli: "https://arbitrum-goerli.rpc.thirdweb.com",
  Fantom: "https://fantom.rpc.thirdweb.com",
  FantomTestnet: "https://fantom-testnet.rpc.thirdweb.com",
  Sepolia: "https://sepolia.rpc.thirdweb.com",
  AvalancheFuji: "https://avalanche-fuji.rpc.thirdweb.com",
};

export const ChainIdToChain: Record<number, Chain> = {
  1: "Ethereum",
  5: "Goerli",
  80001: "Mumbai",
  137: "Polygon",
  43114: "Avalanche",
  10: "Optimism",
  420: "OptimismGoerli",
  56: "BSC",
  97: "BSCTestnet",
  42161: "ArbitrumOne",
  421613: "ArbitrumGoerli",
  250: "Fantom",
  4002: "FantomTestnet",
  11155111: "Sepolia",
  43113: "AvalancheFuji",
};

// General Embedded wallet types
export type Chain =
  | "Polygon"
  | "Mumbai"
  | "Goerli"
  | "Ethereum"
  | "Avalanche"
  | "Optimism"
  | "OptimismGoerli"
  | "BSC"
  | "BSCTestnet"
  | "ArbitrumOne"
  | "ArbitrumGoerli"
  | "Fantom"
  | "FantomTestnet"
  | "Sepolia"
  | "AvalancheFuji";

export type SupportedChainName = Chain | "Rinkeby";
