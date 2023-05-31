import type { ChainInfo } from "../../schema/shared";
import { defaultChains } from "@thirdweb-dev/chains";

// @ts-expect-error
let supportedChains: ChainInfo[] = defaultChains;

/**
 * @internal
 */
export function setSupportedChains(chains: ChainInfo[] | undefined) {
  if (chains && chains.length > 0) {
    supportedChains = chains;
  } else {
    // @ts-expect-error
    supportedChains = defaultChains;
  }
}

/**
 * @internal
 */
export function getSupportedChains() {
  return supportedChains;
}
