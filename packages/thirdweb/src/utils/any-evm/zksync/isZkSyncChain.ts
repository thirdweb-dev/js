import type { Chain } from "../../../chains/types.js";
import { getChainMetadata } from "../../../chains/utils.js";

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
    chain.id === 37111
  ) {
    return true;
  }

  // fallback to checking the stack on rpc
  try {
    const chainMetadata = await getChainMetadata(chain);
    return chainMetadata.stackType === "zksync_stack";
  } catch {
    // If the network check fails, assume it's not a ZkSync chain
    return false;
  }
}
