import type { ClientAndChain } from "../utils/types.js";

export async function getDeployedEntrypointERC20(options: ClientAndChain) {
  // TODO (1): get the create2 factory address
  // TODO (2): get the bootstrap contract factory address from the create2 factory
  // TODO (3): get the entrypoint contract addresses using contract factory OR predict it using the contract factory address
  throw new Error("Asset factory deployment is not deployed yet.");
}
