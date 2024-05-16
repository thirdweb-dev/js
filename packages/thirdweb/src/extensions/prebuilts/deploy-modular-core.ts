import type {
  Abi,
  Address,
} from "abitype";
import type { ThirdwebClient } from "../../client/client.js";
import { getContract } from "../../contract/contract.js";
import { deployViaAutoFactory } from "../../contract/deployment/deploy-via-autofactory.js";
import {
  getOrDeployInfraForPublishedContract,
} from "../../contract/deployment/utils/bootstrap.js";
import type { FileOrBufferOrString } from "../../storage/upload/types.js";
import { fetchPublishedContractMetadata } from "../../contract/deployment/publisher.js";
import type { Chain } from "../../chains/types.js";
import type { Account } from "../../wallets/interfaces/wallet.js";
import { prepareContractCall } from "../../transaction/prepare-contract-call.js";
import { resolveMethod } from "../../transaction/resolve-method.js";

export type MarketplaceContractParams = {
  name: string;
  description?: string;
  image?: FileOrBufferOrString;
  external_link?: string;
  contractURI?: string;
  social_urls?: Record<string, string>;
  defaultAdmin?: Address;
  platformFeeBps?: number;
  platformFeeRecipient?: string;
  trustedForwarders?: string[];
};

export type DeployModularCoreContractOptions = {
  client: ThirdwebClient;
  chain: Chain;
  account: Account;
  contractId: string;
  contractParams: any[];
  publisher?: string;
  version?: string;
  implementationConstructorParams?: unknown[];
};

/**
 * TODO not quite ready for public consumption yet
 * @internal
 */
export async function deployModularCoreContract(
  options: DeployModularCoreContractOptions,
) {
  const {
    client,
    account,
    chain,
    contractId,
    contractParams,
    publisher,
    version,
  } = options;

  const { compilerMetadata, extendedMetadata } =
    await fetchPublishedContractMetadata({
      client,
      contractId,
      publisher,
      version,
    });

  if (
    !extendedMetadata?.routerType ||
    extendedMetadata.routerType !== "modular"
  ) {
    throw new Error("Not modular contract");
  }

  const defaultExtensions = extendedMetadata.defaultExtensions || [];
  const defaultExtensionsDeployed = await Promise.all(
    defaultExtensions.map((e) =>
      getOrDeployInfraForPublishedContract({
        chain,
        client,
        account,
        contractId: e.extensionName,
        constructorParams: [],
        publisher: e.publisherAddress,
      }),
    ),
  );

  const extensionsParamName =
    extendedMetadata.factoryDeploymentData?.modularFactoryInput?.hooksParamName;
  if (extensionsParamName) {
    const initializerParams = extractFunctionParamsFromAbi(
      compilerMetadata.abi,
      extendedMetadata.factoryDeploymentData
        ?.implementationInitializerFunction || "initialize",
    );

    const extensionsParamIndex = initializerParams.findIndex(
      (p) => p.name === extensionsParamName,
    );
    if (
      contractParams[extensionsParamIndex].length === 0 ||
      contractParams[extensionsParamIndex] === "[]"
    ) {
      contractParams[extensionsParamIndex] = defaultExtensionsDeployed.map(
        (d) => d.implementationContract.address,
      );
    }
  }

  const { cloneFactoryContract, implementationContract } =
    await getOrDeployInfraForPublishedContract({
      chain,
      client,
      account,
      contractId: contractId,
      constructorParams: [],
      publisher: publisher
    });

  const initializeTransaction = prepareContractCall({
    contract: getContract({
      client,
      chain,
      address: implementationContract.address,
    }),
    method: resolveMethod(
      extendedMetadata.factoryDeploymentData
        ?.implementationInitializerFunction || "initialize",
    ),
    params: contractParams,
  });

  return deployViaAutoFactory({
    client,
    chain,
    account,
    cloneFactoryContract,
    initializeTransaction,
  });
}

export function extractFunctionParamsFromAbi(abi: Abi, functionName: string) {
  for (const input of abi) {
    if (input.type === "function" && input.name === functionName) {
      return input.inputs || [];
    }
  }
  return [];
}
