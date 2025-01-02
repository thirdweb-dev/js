import { baseSepolia } from "./chain-definitions/base-sepolia.js";
import { base } from "./chain-definitions/base.js";
import { optimismSepolia } from "./chain-definitions/optimism-sepolia.js";
import { optimism } from "./chain-definitions/optimism.js";
import { zoraSepolia } from "./chain-definitions/zora-sepolia.js";
import { zora } from "./chain-definitions/zora.js";
import type { Chain } from "./types.js";

const opChains = [
  base.id,
  baseSepolia.id,
  optimism.id,
  optimismSepolia.id,
  zora.id,
  zoraSepolia.id,
  34443, // mode
  919, // mode testnet
  42220, // celo
  44787, // celo testnet
  204, // opBNB
  5611, // opBNB testnet
];

/**
 * TODO this should be in the chain definition itself
 * @internal
 */
export function isOpStackChain(chain: Chain) {
  return opChains.includes(chain.id);
}
