import { ADDRESS_ZERO } from "../constants/addresses.js";

/**
 * Returns the RoyaltyEngineV1 address for a given chain
 * @param chainId - the chain id
 * @public
 */
export function getRoyaltyEngineV1ByChainId(chainId: number): string {
  return ROYALTY_ENGINE_V1_ADDRESS[chainId] || ADDRESS_ZERO;
}

export const ROYALTY_ENGINE_V1_ADDRESS: Record<number, string> =
  /* @__PURE__ */ {
    1: "0x0385603ab55642cb4dd5de3ae9e306809991804f",
    56: "0xEF770dFb6D5620977213f55f99bfd781D04BBE15",
    137: "0x28EdFcF0Be7E86b07493466e7631a213bDe8eEF2",
    8453: "0xEF770dFb6D5620977213f55f99bfd781D04BBE15",
    43114: "0xEF770dFb6D5620977213f55f99bfd781D04BBE15",
    10: "0xEF770dFb6D5620977213f55f99bfd781D04BBE15",
    42161: "0xEF770dFb6D5620977213f55f99bfd781D04BBE15",
  };
