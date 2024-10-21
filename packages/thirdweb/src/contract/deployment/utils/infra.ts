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
import type { ReplacementValues } from "./bootstrap.js";
import { computeCreate2FactoryAddress } from "./create-2-factory.js";

export type InfraContractId =
  | "WETH9"
  | "Forwarder"
  | "ForwarderEOAOnly"
  | "TWCloneFactory"
  | "MintFeeManagerCore"
  | "MultiSig"
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
export async function getPredictedInfraContractAddress(
  options: GetDeployedInfraParams,
): Promise<string> {
  const contractMetadata = await fetchPublishedContractMetadata({
    client: options.client,
    contractId: options.contractId,
    publisher: options.publisher,
    version: options.version,
  });
  return await computeContractAddress({
    client: options.client,
    chain: options.chain,
    contractMetadata,
    constructorParams: options.constructorParams,
  })
}

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
  replacementValues?: ReplacementValues
}) {
  const { client, chain } = options;
  let params: Record<string, unknown>;
  if(options.contractMetadata.constructorParams) {
    if(!options.constructorParams) {
      Object.keys(options.contractMetadata.constructorParams).forEach(async (key, index) => {
        const param = options.contractMetadata.constructorParams![key];

        if (param?.defaultValue === "{{tw-mintfee-mmanager}}") {
            params[index] = options.replacementValues?.mintFeeManager || "";
        } else if (param?.defaultValue === "{{tw-multisig}}") {
          params[index] = options.replacementValues?.multisig || "";
        } else {
          params[index] = "";
        }
      });
    }
  }

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
        await computeDeploymentInfoFromMetadata({
          ...options,
          constructorParams: params
        });
      return infraContractInfo.initBytecodeWithsalt;
    },
  });
}
