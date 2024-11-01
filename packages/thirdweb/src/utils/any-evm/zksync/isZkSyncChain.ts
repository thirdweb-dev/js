import type { Chain } from "../../../chains/types.js";

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
    chain.id === 978658
  ) {
    return true;
  }

  return false;
}
