import type { Address } from "abitype";
import type { Prettify } from "../../utils/type-utils.js";
import type { SharedDeployOptions } from "./types.js";
import { fetchPublishedContract } from "../verification/publisher.js";
import { prepareDeployTransactionFromUri } from "./deploy-from-uri.js";

export type PrepareDeployTransactionForPublishedContractOptions = Prettify<
  SharedDeployOptions & {
    publisher: Address;
    contractName: string;
    version?: string;
  }
>;

/**
 * Prepares a deploy transaction for a published contract.
 * @param options - The options for deploying the published contract.
 * @returns A promise that resolves to the prepared deploy transaction.
 * @example
 * ```ts
 * const tx = await prepareDeployTransactionForPublishedContract({
 *  client,
 *  publisher: "0x1234",
 *  contractName: "MyContract",
 *  version: "1.0.0",
 *  constructorParams: [123, "hello"],
 *  chain: 1,
 * });
 */
export async function prepareDeployTransactionForPublishedContract(
  options: PrepareDeployTransactionForPublishedContractOptions,
) {
  const publishedContract = await fetchPublishedContract({
    client: options.client,
    publisherAddress: options.publisher,
    contractName: options.contractName,
    version: options.version,
  });

  return prepareDeployTransactionFromUri({
    chain: options.chain,
    client: options.client,
    uri: publishedContract.publishMetadataUri,
    constructorParams: options.constructorParams,
    forceDirectDeploy: options.forceDirectDeploy,
    saltForProxyDeploy: options.saltForProxyDeploy,
  });
}
