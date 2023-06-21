// excerpt from https://docs.gnosis-safe.io/backend/available-services
export const CHAIN_ID_TO_GNOSIS_SERVER_URL = {
  // mainnet
  1: "https://safe-transaction-mainnet.safe.global",
  // avalanche
  43114: "https://safe-transaction-avalanche.safe.global",
  // polygon
  137: "https://safe-transaction-polygon.safe.global",
  // goerli
  5: "https://safe-transaction-goerli.safe.global",
  // bsc
  56: "https://safe-transaction-bsc.safe.global",
  // optimism
  10: "https://safe-transaction-optimism.safe.global",
} as const;

export const SafeSupportedChainsSet = /* @__PURE__ */ (() =>
  new Set(Object.keys(CHAIN_ID_TO_GNOSIS_SERVER_URL).map(Number)))();
