import type { Chain } from "../../../chains/types.js";

/**
 * Checks whether the given chain is part of the zksync stack
 * @param chain
 * @chain
 */
export async function isZkSyncChain(chain: Chain) {
  if (chain.id === 1337 || chain.id === 31337) {
    return false;
  }

  // check known zksync chain-ids first
  if (
    chain.id === 324 ||
    chain.id === 300 ||
    chain.id === 302 ||
    chain.id === 11124 ||
    chain.id === 282 ||
    chain.id === 388 ||
    chain.id === 4654 ||
    chain.id === 333271 ||
    chain.id === 37111 ||
    chain.id === 978658 ||
    chain.id === 531050104 ||
    chain.id === 4457845 ||
    chain.id === 2741 ||
    chain.id === 240 ||
    chain.id === 555271 ||
    chain.id === 61166 ||
    chain.id === 555272
  ) {
    return true;
  }

  // fallback to checking the stack on rpc
  try {
    const { getChainMetadata } = await import("../../../chains/utils.js");
    const chainMetadata = await getChainMetadata(chain);
    return chainMetadata.stackType === "zksync_stack";
  } catch {
    // If the network check fails, assume it's not a ZkSync chain
    return false;
  }
}
