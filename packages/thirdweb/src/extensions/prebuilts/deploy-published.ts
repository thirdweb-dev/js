import type { AbiFunction } from "abitype";
import type { Chain } from "../../chains/types.js";
import type { ThirdwebClient } from "../../client/client.js";
import { type ThirdwebContract, getContract } from "../../contract/contract.js";
import { fetchPublishedContractMetadata } from "../../contract/deployment/publisher.js";
import { getOrDeployInfraContractFromMetadata } from "../../contract/deployment/utils/bootstrap.js";
import { sendAndConfirmTransaction } from "../../transaction/actions/send-and-confirm-transaction.js";
import { simulateTransaction } from "../../transaction/actions/simulate.js";
import { prepareContractCall } from "../../transaction/prepare-contract-call.js";
import { resolveMethod } from "../../transaction/resolve-method.js";
import { encodeAbiParameters } from "../../utils/abi/encodeAbiParameters.js";
import { normalizeFunctionParams } from "../../utils/abi/normalizeFunctionParams.js";
import { getAddress } from "../../utils/address.js";
import {
  type CompilerMetadata,
  fetchBytecodeFromCompilerMetadata,
} from "../../utils/any-evm/deploy-metadata.js";
import type { FetchDeployMetadataResult } from "../../utils/any-evm/deploy-metadata.js";
import { encodeExtraDataWithUri } from "../../utils/any-evm/encode-extra-data-with-uri.js";
import type { Hex } from "../../utils/encoding/hex.js";
import type { Account } from "../../wallets/interfaces/wallet.js";
import { getAllDefaultConstructorParamsForImplementation } from "./get-required-transactions.js";
import {
  type ImplementationConstructorParam,
  processRefDeployments,
} from "./process-ref-deployments.js";

/**
 * @extension DEPLOY
 */
export type DeployPublishedContractOptions = {
  client: ThirdwebClient;
  chain: Chain;
  account: Account;
  contractId: string;
  contractParams?: Record<string, unknown>;
  publisher?: string;
  version?: string;
  implementationConstructorParams?: Record<string, unknown>;
  salt?: string;
};

/**
 * Deploy an instance of a published contract on a given chain
 * @param options - the deploy options
 * @returns a promise that resolves to the deployed contract address
 * @example
 *
 * ## Deploying a published contract
 *
 * ```ts
 * import { deployPublishedContract } from "thirdweb/deploys";
 *
 * const address = await deployPublishedContract({
 *   client,
 *   chain,
 *   account,
 *   contractId: "MyPublishedContract",
 *   contractParams: {
 *     param1: "value1",
 *     param2: 123,
 *   },
 *   publisher: "0x...", // optional, defaults to the thirdweb deployer
 * });
 * ```
 *
 *  ## Deploying a published contract deterministically
 *
 * ```ts
 * import { deployPublishedContract } from "thirdweb/deploys";
 *
 * const address = await deployPublishedContract({
 *   client,
 *   chain,
 *   account,
 *   contractId: "MyPublishedContract",
 *   contractParams: {
 *     param1: "value1",
 *     param2: 123,
 *   },
 *   publisher: "0x...",
 *   salt: "your-salt", // this will deterministically deploy the contract at the same address on all chains
 * });
 * ```
 * @extension DEPLOY
 */
export async function deployPublishedContract(
  options: DeployPublishedContractOptions,
): Promise<string> {
  const {
    client,
    account,
    chain,
    contractId,
    contractParams,
    publisher,
    version,
    implementationConstructorParams,
    salt,
  } = options;
  const deployMetadata = await fetchPublishedContractMetadata({
    client,
    contractId,
    publisher,
    version,
  });

  return deployContractfromDeployMetadata({
    account,
    chain,
    deployMetadata,
    client,
    initializeParams: {
      ...deployMetadata.constructorParams,
      ...contractParams,
    },
    implementationConstructorParams: {
      ...deployMetadata.implConstructorParams,
      ...implementationConstructorParams,
    },
    salt,
  });
}

/**
 * @internal
 */
export type DeployContractfromDeployMetadataOptions = {
  client: ThirdwebClient;
  chain: Chain;
  account: Account;
  deployMetadata: FetchDeployMetadataResult;
  initializeParams?: Record<string, unknown>;
  initializeData?: `0x${string}`;
  implementationConstructorParams?: Record<string, unknown>;
  isCrosschain?: boolean;
  modules?: {
    deployMetadata: FetchDeployMetadataResult;
    initializeParams?: Record<string, unknown>;
  }[];
  salt?: string;
};

/**
 * @internal
 */
export async function deployContractfromDeployMetadata(
  options: DeployContractfromDeployMetadataOptions,
): Promise<string> {
  const {
    client,
    account,
    chain,
    initializeParams,
    initializeData,
    deployMetadata,
    isCrosschain,
    implementationConstructorParams,
    modules,
    salt,
  } = options;

  let processedImplParams: Record<string, string | string[]> | undefined;
  let processedInitializeParams: Record<string, string | string[]> | undefined;

  if (implementationConstructorParams) {
    processedImplParams = {};
    for (const key in implementationConstructorParams) {
      processedImplParams[key] = await processRefDeployments({
        client,
        account,
        chain,
        paramValue: implementationConstructorParams[key] as
          | string
          | ImplementationConstructorParam,
      });
    }
  }

  if (initializeParams) {
    processedInitializeParams = {};
    for (const key in initializeParams) {
      processedInitializeParams[key] = await processRefDeployments({
        client,
        account,
        chain,
        paramValue: initializeParams[key] as
          | string
          | ImplementationConstructorParam,
      });
    }
  }

  switch (deployMetadata?.deployType) {
    case "standard": {
      return directDeploy({
        account,
        client,
        chain,
        compilerMetadata: deployMetadata,
        contractParams: processedInitializeParams,
        salt,
        metadataUri: deployMetadata.metadataUri,
      });
    }
    case "autoFactory": {
      const [
        { deployViaAutoFactory },
        { getOrDeployInfraForPublishedContract },
      ] = await Promise.all([
        import("../../contract/deployment/deploy-via-autofactory.js"),
        import("../../contract/deployment/utils/bootstrap.js"),
      ]);

      if (
        deployMetadata.routerType === "dynamic" &&
        deployMetadata.defaultExtensions
      ) {
        for (const e of deployMetadata.defaultExtensions) {
          await getOrDeployInfraForPublishedContract({
            chain,
            client,
            account,
            contractId: e.extensionName,
            version: e.extensionVersion || "latest",
            publisher: e.publisherAddress,
            constructorParams:
              await getAllDefaultConstructorParamsForImplementation({
                chain,
                client,
                contractId: e.extensionName,
              }),
          });
        }
      }

      const { cloneFactoryContract, implementationContract } =
        await getOrDeployInfraForPublishedContract({
          chain,
          client,
          account,
          contractId: deployMetadata.name,
          constructorParams: {
            ...(await getAllDefaultConstructorParamsForImplementation({
              chain,
              client,
              contractId: deployMetadata.name,
              defaultExtensions: deployMetadata.defaultExtensions,
            })),
            ...processedImplParams,
          },
          publisher: deployMetadata.publisher,
          version: deployMetadata.version,
        });

      if (isCrosschain) {
        return deployViaAutoFactory({
          client,
          chain,
          account,
          cloneFactoryContract,
          implementationAddress: implementationContract.address,
          initializeData,
          salt,
          isCrosschain,
        });
      }

      const initializeTransaction = await getInitializeTransaction({
        client,
        chain,
        deployMetadata,
        implementationContract,
        initializeParams: processedInitializeParams,
        account,
        modules,
      });
      return deployViaAutoFactory({
        client,
        chain,
        account,
        cloneFactoryContract,
        initializeTransaction,
        salt,
      });
    }
    case "customFactory": {
      if (!deployMetadata?.factoryDeploymentData?.customFactoryInput) {
        throw new Error("No custom factory info found");
      }
      const factoryAddress =
        deployMetadata?.factoryDeploymentData?.customFactoryInput
          ?.customFactoryAddresses?.[chain.id];
      const factoryFunction =
        deployMetadata.factoryDeploymentData?.customFactoryInput
          ?.factoryFunction;
      if (!factoryAddress || !factoryFunction) {
        throw new Error(`No factory address found on chain ${chain.id}`);
      }

      const factory = getContract({
        client,
        chain,
        address: factoryAddress,
      });
      const method = await resolveMethod(factoryFunction)(factory);
      const deployTx = prepareContractCall({
        contract: factory,
        method,
        params: normalizeFunctionParams(method, initializeParams),
      });
      // asumption here is that the factory address returns the deployed proxy address
      const address = await simulateTransaction({
        transaction: deployTx,
      });
      await sendAndConfirmTransaction({
        transaction: deployTx,
        account,
      });
      return address as string;
    }
    case undefined: {
      // Default to standard deployment if none was specified
      return directDeploy({
        account,
        client,
        chain,
        compilerMetadata: deployMetadata,
        contractParams: processedInitializeParams,
        salt,
        metadataUri: deployMetadata.metadataUri,
      });
    }
    default:
      // If a deployType was specified but we don't support it, throw an error
      throw new Error(`Unsupported deploy type: ${deployMetadata?.deployType}`);
  }
}

async function directDeploy(options: {
  account: Account;
  client: ThirdwebClient;
  chain: Chain;
  compilerMetadata: CompilerMetadata;
  contractParams?: Record<string, unknown>;
  salt?: string;
  metadataUri?: string;
}): Promise<string> {
  const { account, client, chain, compilerMetadata, contractParams, salt } =
    options;

  const { deployContract } = await import(
    "../../contract/deployment/deploy-with-abi.js"
  );
  const isStylus = options.compilerMetadata.metadata.language === "rust";
  return deployContract({
    account,
    client,
    chain,
    bytecode: await fetchBytecodeFromCompilerMetadata({
      compilerMetadata,
      client,
      chain,
    }),
    abi: compilerMetadata.abi,
    constructorParams: contractParams,
    salt,
    extraDataWithUri:
      isStylus && options.metadataUri
        ? encodeExtraDataWithUri({
            metadataUri: options.metadataUri,
          })
        : undefined,
    isStylus,
  });
}

/**
 * Prepares the initialization transaction for a contract deployment
 * @param options - The options for generating the initialize transaction
 * @param options.client - The ThirdwebClient instance
 * @param options.chain - The blockchain network configuration
 * @param options.account - The account performing the initialization
 * @param options.implementationContract - The contract implementation to initialize
 * @param options.deployMetadata - The metadata for the contract deployment
 * @param options.initializeParams - Optional parameters to pass to the initialize function
 * @param options.modules - Optional array of modules to install during initialization
 * @param options.modules[].deployMetadata - The metadata for the module contract
 * @param options.modules[].initializeParams - Optional parameters for module initialization
 * @returns The prepared transaction for contract initialization
 * @contract
 */
export async function getInitializeTransaction(options: {
  client: ThirdwebClient;
  chain: Chain;
  account: Account;
  implementationContract: ThirdwebContract;
  deployMetadata: FetchDeployMetadataResult;
  initializeParams?: Record<string, unknown>;
  modules?: {
    deployMetadata: FetchDeployMetadataResult;
    initializeParams?: Record<string, unknown>;
  }[];
}) {
  const {
    account,
    client,
    chain,
    deployMetadata: metadata,
    initializeParams = {},
    implementationContract,
    modules = [],
  } = options;

  const initializeFunction = metadata.abi.find(
    (i) =>
      i.type === "function" &&
      i.name ===
        (metadata.factoryDeploymentData?.implementationInitializerFunction ||
          "initialize"),
  ) as AbiFunction;
  if (!initializeFunction) {
    throw new Error(`Could not find initialize function for ${metadata.name}`);
  }

  const hasModules =
    initializeFunction.inputs.find(
      (i) => i.name === "modules" || i.name === "_modules",
    ) &&
    initializeFunction.inputs.find(
      (i) => i.name === "moduleInstallData" || i.name === "_moduleInstallData",
    );
  if (hasModules) {
    const moduleAddresses: Hex[] = [];
    const moduleInstallData: Hex[] = [];
    for (const module of modules) {
      // deploy the module if not already deployed
      const contract = await getOrDeployInfraContractFromMetadata({
        client,
        chain,
        account,
        contractMetadata: module.deployMetadata,
      });

      const installFunction = module.deployMetadata.abi.find(
        (i) => i.type === "function" && i.name === "encodeBytesOnInstall",
      ) as AbiFunction | undefined;

      moduleAddresses.push(getAddress(contract.address));
      moduleInstallData.push(
        installFunction
          ? encodeAbiParameters(
              installFunction.inputs,
              normalizeFunctionParams(installFunction, module.initializeParams),
            )
          : "0x",
      );
    }
    initializeParams.modules = moduleAddresses;
    initializeParams.moduleInstallData = moduleInstallData;
  }

  const initializeTransaction = prepareContractCall({
    contract: getContract({
      client,
      chain,
      address: implementationContract.address,
    }),
    method: initializeFunction,
    params: normalizeFunctionParams(initializeFunction, initializeParams),
  });
  return initializeTransaction;
}
