import { getContract } from "../contract/contract.js";
import type {
  ClientAndChain,
} from "../utils/types.js";
import { IMPLEMENTATIONS } from "./constants.js";

export async function getEntrypointERC20(options: ClientAndChain) {
  const implementations = IMPLEMENTATIONS[options.chain.id];

  if (implementations?.EntrypointERC20) {
    return getContract({
      address: implementations.EntrypointERC20,
      chain: options.chain,
      client: options.client,
    });
  }

  // TODO (1): get the create2 factory address
  // TODO (2): get the bootstrap factory address from the create2 factory
  // TODO (3): predict or get the contract addresses
  throw new Error("Asset factory deployment is not deployed yet.");
}
