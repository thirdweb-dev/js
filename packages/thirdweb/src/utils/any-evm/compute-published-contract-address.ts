import type { Chain } from "../../chains/types.js";
import type { ThirdwebClient } from "../../client/client.js";
import { computeDeploymentAddress } from "./compute-deployment-address.js";
import {
  computeDeploymentInfoFromContractId,
  computeDeploymentInfoFromMetadata,
} from "./compute-published-contract-deploy-info.js";
import type { FetchDeployMetadataResult } from "./deploy-metadata.js";

/**
 * Predicts the implementation address of any published contract
 * @param args - The arguments for predicting the address of a published contract.
 * @param args.client - The Thirdweb client.
 * @param args.chain - The chain to predict the address on.
 * @param args.constructorParams - The parameters for the contract constructor.
 * @param args.contractId - The contract id.
 * @param args.publisher - The publisher of the contract.
 * @param args.version - The version of the contract.
 * @example
 * ```ts
 * import { computePublishedContractAddress } from "thirdweb/deploys";
 *
 * const contractMetadata = await fetchPublishedContractMetadata({
 *  client,
 *  chain,
 * });
 * const address = await computePublishedContractAddress({
 *   client,
 *   chain,
 *   contractId: "AccountFactory",
 *   constructorParams,
 * });
 * ```
 * @returns A promise that resolves to the predicted address of the contract.
 * @extension DEPLOY
 */
export async function computePublishedContractAddress(args: {
  client: ThirdwebClient;
  chain: Chain;
  contractId: string;
  constructorParams: unknown[];
  publisher?: string;
  version?: string;
  salt?: string;
}): Promise<string> {
  const info = await computeDeploymentInfoFromContractId(args);
  return computeDeploymentAddress(info);
}

/**
 * @internal
 */
export async function computeContractAddress(args: {
  client: ThirdwebClient;
  chain: Chain;
  contractMetadata: FetchDeployMetadataResult;
  constructorParams: unknown[];
  salt?: string;
}): Promise<string> {
  const info = await computeDeploymentInfoFromMetadata(args);
  return computeDeploymentAddress(info);
}
