import type { Chain } from "../../chains/types.js";
import type { ThirdwebClient } from "../../client/client.js";
import { fetchPublishedContractMetadata } from "../../contract/deployment/publisher.js";
import { computeDeploymentAddress } from "./compute-deployment-address.js";
import { computeDeploymentInfoFromMetadata } from "./compute-published-contract-deploy-info.js";
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
  constructorParams?: Record<string, unknown>;
  publisher?: string;
  version?: string;
  salt?: string;
}): Promise<string> {
  const contractMetadata = await fetchPublishedContractMetadata({
    client: args.client,
    contractId: args.contractId,
    publisher: args.publisher,
    version: args.version,
  });
  return computeContractAddress({
    chain: args.chain,
    client: args.client,
    constructorParams: args.constructorParams,
    contractMetadata,
    salt: args.salt,
  });
}

/**
 * @internal
 */
export async function computeContractAddress(args: {
  client: ThirdwebClient;
  chain: Chain;
  contractMetadata: FetchDeployMetadataResult;
  constructorParams?: Record<string, unknown>;
  salt?: string;
}): Promise<string> {
  const info = await computeDeploymentInfoFromMetadata(args);
  return computeDeploymentAddress(info);
}
