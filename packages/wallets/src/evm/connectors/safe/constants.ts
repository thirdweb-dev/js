import { SafeSupportedChains } from "./types";

// excerpt from https://docs.safe.global/api-supported-networks#safe-transaction-service
export const CHAIN_ID_TO_GNOSIS_SERVER_URL: Record<
  SafeSupportedChains,
  string
> = {
  // mainnet
  1: "https://safe-transaction-mainnet.safe.global",
  // Sepolia
  11155111: "https://safe-transaction-sepolia.safe.global",
  // optimism
  10: "https://safe-transaction-optimism.safe.global",
  // bsc
  56: "https://safe-transaction-bsc.safe.global",
  // gnosis
  100: "https://safe-transaction-gnosis-chain.safe.global",
  // polygon
  137: "https://safe-transaction-polygon.safe.global",
  // avalanche
  43114: "https://safe-transaction-avalanche.safe.global",
  // arbitrum
  42161: "https://safe-transaction-arbitrum.safe.global",
  // celo
  42220: "https://safe-transaction-celo.safe.global",
  // Base mainnet
  8453: "https://safe-transaction-base.safe.global",
  // aurora
  1313161554: "https://safe-transaction-aurora.safe.global",
};
