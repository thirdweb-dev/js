import type { Chain } from "../../../chains/types.js";
import type { ThirdwebClient } from "../../../client/client.js";
import { prepareTransaction } from "../../../transaction/prepare-transaction.js";
import { computeContractAddress } from "../../../utils/any-evm/compute-published-contract-address.js";
import { computeDeploymentInfoFromMetadata } from "../../../utils/any-evm/compute-published-contract-deploy-info.js";
import type { FetchDeployMetadataResult } from "../../../utils/any-evm/deploy-metadata.js";
import { isContractDeployed } from "../../../utils/bytecode/is-contract-deployed.js";
import type { Prettify } from "../../../utils/type-utils.js";
import type { ClientAndChain } from "../../../utils/types.js";
import { getContract, type ThirdwebContract } from "../../contract.js";
import { fetchPublishedContractMetadata } from "../publisher.js";
import { computeCreate2FactoryAddress } from "./create-2-factory.js";

export type InfraContractId =
  | "WETH9"
  | "Forwarder"
  | "ForwarderEOAOnly"
  | "TWCloneFactory"
  | (string & {});

type GetDeployedInfraParams = Prettify<
  ClientAndChain & {
    contractId: InfraContractId;
    constructorParams?: Record<string, unknown>;
    publisher?: string;
    version?: string;
  }
>;

/**
 * Retrieves a deployed infrastructure contract instance for the specified contract ID
 * @param options - Configuration options for locating the infrastructure contract
 * @param options.client - ThirdwebClient instance
 * @param options.chain - Target blockchain network
 * @param options.contractId - Identifier for the infrastructure contract (e.g. "WETH9", "Forwarder")
 * @param options.constructorParams - Optional constructor parameters for contract initialization
 * @param options.publisher - Optional custom publisher address
 * @param options.version - Optional specific contract version to retrieve
 * @returns Promise that resolves to the contract instance if deployed, null otherwise
 *
 * @internal
 */
export async function getDeployedInfraContract(
  options: GetDeployedInfraParams,
): Promise<ThirdwebContract | null> {
  const contractMetadata = await fetchPublishedContractMetadata({
    client: options.client,
    contractId: options.contractId,
    publisher: options.publisher,
    version: options.version,
  });
  return getDeployedInfraContractFromMetadata({
    chain: options.chain,
    client: options.client,
    constructorParams: options.constructorParams,
    contractMetadata,
  });
}

/**
 * @internal
 */
export async function getDeployedInfraContractFromMetadata(options: {
  client: ThirdwebClient;
  chain: Chain;
  contractMetadata: FetchDeployMetadataResult;
  constructorParams?: Record<string, unknown>;
  salt?: string;
}): Promise<ThirdwebContract | null> {
  const address = await computeContractAddress(options);
  const factory = getContract({
    ...options,
    address,
  });
  if (await isContractDeployed(factory)) {
    return factory;
  }
  return null;
}

/**
 * @internal
 */
export function prepareInfraContractDeployTransactionFromMetadata(options: {
  client: ThirdwebClient;
  chain: Chain;
  contractMetadata: FetchDeployMetadataResult;
  constructorParams?: Record<string, unknown>;
  salt?: string;
}) {
  const { client, chain } = options;
  return prepareTransaction({
    chain,
    client,
    data: async () => {
      const infraContractInfo =
        await computeDeploymentInfoFromMetadata(options);
      return infraContractInfo.initCalldata;
    },
    to: () =>
      computeCreate2FactoryAddress({
        chain,
        client,
      }),
  });
}
