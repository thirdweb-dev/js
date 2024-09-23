import type { Chain } from "../../../chains/types.js";
import type { ThirdwebClient } from "../../../client/client.js";
import { prepareTransaction } from "../../../transaction/prepare-transaction.js";
import { computeContractAddress } from "../../../utils/any-evm/compute-published-contract-address.js";
import { computeDeploymentInfoFromMetadata } from "../../../utils/any-evm/compute-published-contract-deploy-info.js";
import type { FetchDeployMetadataResult } from "../../../utils/any-evm/deploy-metadata.js";
import { isContractDeployed } from "../../../utils/bytecode/is-contract-deployed.js";
import type { Prettify } from "../../../utils/type-utils.js";
import type { ClientAndChain } from "../../../utils/types.js";
import { type ThirdwebContract, getContract } from "../../contract.js";
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
    client: options.client,
    chain: options.chain,
    contractMetadata,
    constructorParams: options.constructorParams,
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
    client,
    chain,
    to: () =>
      computeCreate2FactoryAddress({
        client,
        chain,
      }),
    data: async () => {
      const infraContractInfo =
        await computeDeploymentInfoFromMetadata(options);
      return infraContractInfo.initBytecodeWithsalt;
    },
  });
}
