// excerpt from https://docs.gnosis-safe.io/backend/available-services
export const CHAIN_ID_TO_GNOSIS_SERVER_URL = {
  // mainnet
  1: "https://safe-transaction-mainnet.safe.global",
  // goerli
  5: "https://safe-transaction-goerli.safe.global",
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
  // base goerli
  84531: "https://safe-transaction-base-testnet.safe.global",
  // aurora
  1313161554: "https://safe-transaction-aurora.safe.global",
} as const;

/**
 * @internal
 */
export const SafeSupportedChainsSet = /* @__PURE__ */ (() =>
  new Set(Object.keys(CHAIN_ID_TO_GNOSIS_SERVER_URL).map(Number)))();
