import type { ChainInfo } from "../../schema/shared/ChainInfo";
import {
  Base,
  BaseGoerli,
  Optimism,
  OptimismGoerli,
  Zora,
  ZoraTestnet,
  defaultChains,
} from "@thirdweb-dev/chains";

// @ts-expect-error - readonly vs not
let supportedChains: ChainInfo[] = defaultChains;

/**
 * @internal
 */
export function setSupportedChains(chains: ChainInfo[] | undefined) {
  if (chains && chains.length > 0) {
    supportedChains = chains;
  } else {
    // @ts-expect-error - readonly vs not
    supportedChains = defaultChains;
  }
}

/**
 * @internal
 */
export function getSupportedChains() {
  return supportedChains;
}

export const OP_STACK_CHAINS = [
  Optimism,
  Base,
  Zora,
  OptimismGoerli,
  BaseGoerli,
  ZoraTestnet,
];
