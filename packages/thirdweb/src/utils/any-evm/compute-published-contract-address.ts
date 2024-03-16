import type { ThirdwebClient } from "../../client/client.js";
import { computeDeploymentAddress } from "./compute-deployment-address.js";
import type { Chain } from "../../chains/types.js";
import {
  computeDeploymentInfoFromContractId,
  computeDeploymentInfoFromMetadata,
} from "./compute-published-contract-deploy-info.js";
import type { PreDeployMetadata } from "./deploy-metadata.js";

/**
 * Predicts the implementation address of any published contract
 * @param args - The arguments for predicting the address of a published contract.
 * @param args.client - The Thirdweb client.
 * @param args.chain - The chain to predict the address on.
 * @param args.contractId - The ID of the contract to predict the address of.
 * @param args.constructorParams - The parameters for the contract constructor.
 * @example
 * ```ts
 * import { computePublishedContractAddress } from "thirdweb/contract";
 *
 * const address = await computeAddressFromContractId({
 *   client,
 *   chain,
 *   contractId,
 *   constructorParams,
 * });
 * ```
 * @returns A promise that resolves to the predicted address of the contract.
 */
export async function computeAddressFromContractId(args: {
  client: ThirdwebClient;
  chain: Chain;
  contractId: string;
  constructorParams: unknown[];
}): Promise<string> {
  const info = await computeDeploymentInfoFromContractId(args);
  return computeDeploymentAddress(info);
}

/**
 * @internal
 */
export async function computeAddressFromMetadata(args: {
  client: ThirdwebClient;
  chain: Chain;
  compilerMetadata: PreDeployMetadata;
  constructorParams: unknown[];
}): Promise<string> {
  const info = await computeDeploymentInfoFromMetadata(args);
  return computeDeploymentAddress(info);
}
