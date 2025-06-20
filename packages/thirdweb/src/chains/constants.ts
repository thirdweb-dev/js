import { base } from "./chain-definitions/base.js";
import { baseSepolia } from "./chain-definitions/base-sepolia.js";
import { optimism } from "./chain-definitions/optimism.js";
import { optimismSepolia } from "./chain-definitions/optimism-sepolia.js";
import { zora } from "./chain-definitions/zora.js";
import { zoraSepolia } from "./chain-definitions/zora-sepolia.js";
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
export async function isOpStackChain(chain: Chain) {
  if (chain.id === 1337 || chain.id === 31337) {
    return false;
  }

  if (opChains.includes(chain.id)) {
    return true;
  }
  // fallback to checking the stack on rpc
  try {
    const { getChainMetadata } = await import("./utils.js");
    const chainMetadata = await getChainMetadata(chain);
    return chainMetadata.stackType === "optimism_bedrock";
  } catch {
    // If the network check fails, assume it's not a OP chain
    return false;
  }
}
