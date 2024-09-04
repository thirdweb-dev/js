import type { Chain } from "../../../chains/types.js";

export function isZkSyncChain(chain: Chain) {
  return (
    chain.id === 324 ||
    chain.id === 300 ||
    chain.id === 302 ||
    chain.id === 11124
  );
}
