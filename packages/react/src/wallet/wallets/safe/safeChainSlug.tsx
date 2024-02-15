import type { SafeSupportedChains } from "@thirdweb-dev/wallets/evm/connectors/safe";

// maps safe chain id to safe-chain slug
export const safeChainIdToSlug: Record<SafeSupportedChains, string> = {
  1: "eth",
  137: "matic",
  43114: "avax",
  56: "bnb",
  10: "oeth",
  8453: "base",
  11155111: "sep",
  100: "gno",
  1313161554: "aurora",
  42161: "arb1",
  42220: "celo",
  1101: "zkevm",
  324: "zksync",
};

// maps safe chain slug to chain id
export const safeSlugToChainId = /* @__PURE__ */ (() => {
  const result: Record<string, SafeSupportedChains> = {};
  for (const [chainId, prefix] of Object.entries(safeChainIdToSlug)) {
    result[prefix] = Number(chainId) as SafeSupportedChains;
  }
  return result;
})();
