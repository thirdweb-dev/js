import type { Abi, AbiFunction } from "abitype";
import { toFunctionSelector, toFunctionSignature } from "viem";
import type { Chain } from "../../chains/types.js";
import type { ThirdwebClient } from "../../client/client.js";
import { resolveContractAbi } from "../../contract/actions/resolve-abi.js";
import { getDeployedCreate2Factory } from "../../contract/deployment/utils/create-2-factory.js";
import {
  getDeployedInfraContract,
  getDeployedInfraContractFromMetadata,
} from "../../contract/deployment/utils/infra.js";
import { ZKSYNC_WETH } from "../../contract/deployment/zksync/implementations.js";
import { computePublishedContractAddress } from "../../utils/any-evm/compute-published-contract-address.js";
import type { FetchDeployMetadataResult } from "../../utils/any-evm/deploy-metadata.js";
import { isZkSyncChain } from "../../utils/any-evm/zksync/isZkSyncChain.js";
import type { DeployContractfromDeployMetadataOptions } from "./deploy-published.js";

/**
 * @internal
 */
type DeployTransactionType =
  | "infra"
  | "implementation"
  | "module"
  | "extension"
  | "proxy";

/**
 * @internal
 */
type DynamicContractExtension = {
  extensionName: string;
  extensionVersion: string;
  publisherAddress: string;
};

/**
 * @internal
 */
type DeployTransactionResult = {
  type: DeployTransactionType;
  contractId: string;
};

/**
 * @internal
 */
export async function getRequiredTransactions(
  options: Omit<
    DeployContractfromDeployMetadataOptions,
    "account" | "initializeParams"
  >,
): Promise<DeployTransactionResult[]> {
  const {
    chain,
    client,
    deployMetadata,
    implementationConstructorParams,
    modules = [],
  } = options;

  const isZkSync = await isZkSyncChain(chain);

  if (deployMetadata?.deployType === "autoFactory") {
    const results: (
      | DeployTransactionResult
      | DeployTransactionResult[]
      | null
    )[] = await Promise.all([
      isZkSync
        ? null
        : getDeployedCreate2Factory({
            chain,
            client,
          }).then((c) =>
            c
              ? null
              : ({ contractId: "Create2Factory", type: "infra" } as const),
          ),
      isZkSync
        ? null
        : getDeployedInfraContract({
            chain,
            client,
            contractId: "Forwarder",
          }).then((c) =>
            c ? null : ({ contractId: "Forwarder", type: "infra" } as const),
          ),
      isZkSync
        ? null
        : getDeployedInfraContract({
            chain,
            client,
            constructorParams: {
              _trustedForwarder: await computePublishedContractAddress({
                chain,
                client,
                contractId: "Forwarder",
              }),
            },
            contractId: "TWCloneFactory",
          }).then((c) =>
            c
              ? null
              : ({ contractId: "TWCloneFactory", type: "infra" } as const),
          ),
      // TODO (deploy): add WETH contract check for implementations that need it (check implementation constructor params)
      getTransactionsForImplementation({
        chain,
        client,
        deployMetadata,
        implementationConstructorParams,
      }),
      ...modules.map((m) =>
        getDeployedInfraContractFromMetadata({
          chain,
          client,
          contractMetadata: m.deployMetadata,
        }).then((c) =>
          c
            ? null
            : ({
                contractId: m.deployMetadata.name,
                type: "module",
              } as const),
        ),
      ),
    ]);
    results.push({ contractId: deployMetadata.name, type: "proxy" });
    return results.flat().filter((r) => r !== null);
  }

  return [{ contractId: deployMetadata.name, type: "implementation" }];
}

async function getTransactionsForImplementation(options: {
  chain: Chain;
  client: ThirdwebClient;
  deployMetadata: FetchDeployMetadataResult;
  implementationConstructorParams?: Record<string, unknown>;
}): Promise<DeployTransactionResult[]> {
  const { chain, client, deployMetadata, implementationConstructorParams } =
    options;

  if (deployMetadata.name === "MarketplaceV3") {
    return getTransactionsForMarketplaceV3(options);
  }

  if (deployMetadata.routerType === "dynamic") {
    return getTransactionsForDynamicContract(options);
  }

  const constructorParams =
    implementationConstructorParams ??
    (await getAllDefaultConstructorParamsForImplementation({
      chain,
      client,
      contractId: deployMetadata.name,
    }));

  const result = await getDeployedInfraContract({
    chain,
    client,
    constructorParams,
    contractId: deployMetadata.name,
    publisher: deployMetadata.publisher,
    version: deployMetadata.version,
  }).then((c) =>
    c
      ? null
      : ({
          contractId: deployMetadata.name,
          type: "implementation",
        } as const),
  );
  return result ? [result] : [];
}

async function getTransactionsForMarketplaceV3(options: {
  chain: Chain;
  client: ThirdwebClient;
}): Promise<DeployTransactionResult[]> {
  const { chain, client } = options;
  const WETHAddress = await computePublishedContractAddress({
    chain,
    client,
    contractId: "WETH9",
  });
  const extensions: (DeployTransactionResult | null)[] = await Promise.all([
    getDeployedInfraContract({
      chain,
      client,
      contractId: "WETH9",
    }).then((c) =>
      c ? null : ({ contractId: "WETH9", type: "infra" } as const),
    ),
    getDeployedInfraContract({
      chain,
      client,
      constructorParams: { _nativeTokenWrapper: WETHAddress },
      contractId: "DirectListingsLogic",
    }).then((c) =>
      c
        ? null
        : ({ contractId: "DirectListingsLogic", type: "extension" } as const),
    ),
    getDeployedInfraContract({
      chain,
      client,
      constructorParams: { _nativeTokenWrapper: WETHAddress },
      contractId: "EnglishAuctionsLogic",
    }).then((c) =>
      c
        ? null
        : ({ contractId: "EnglishAuctionsLogic", type: "extension" } as const),
    ),
    getDeployedInfraContract({
      chain,
      client,
      contractId: "OffersLogic",
    }).then((c) =>
      c ? null : ({ contractId: "OffersLogic", type: "extension" } as const),
    ),
  ]);
  // hacky assumption: if we need to deploy any of the extensions, we also need to deploy the implementation
  const transactions = extensions.filter((e) => e !== null);
  if (transactions.length) {
    transactions.push({ contractId: "MarketplaceV3", type: "implementation" });
  }
  return transactions;
}

async function getTransactionsForDynamicContract(options: {
  chain: Chain;
  client: ThirdwebClient;
  deployMetadata: FetchDeployMetadataResult;
}): Promise<DeployTransactionResult[]> {
  const { chain, client } = options;
  const WETHAddress = await computePublishedContractAddress({
    chain,
    client,
    contractId: "WETH9",
  });
  const wethTx = await getDeployedInfraContract({
    chain,
    client,
    contractId: "WETH9",
  }).then((c) =>
    c ? null : ({ contractId: "WETH9", type: "infra" } as const),
  );
  const extensions: (DeployTransactionResult | null)[] = options.deployMetadata
    .defaultExtensions
    ? await Promise.all(
        options.deployMetadata.defaultExtensions.map((e) => {
          return getDeployedInfraContract({
            chain,
            client,
            constructorParams: { _nativeTokenWrapper: WETHAddress },
            contractId: e.extensionName,
            publisher: e.publisherAddress,
            version: e.extensionVersion || "latest",
          }).then((c) =>
            c
              ? null
              : ({ contractId: e.extensionName, type: "extension" } as const),
          );
        }),
      )
    : [];
  // hacky assumption: if we need to deploy any of the extensions, we also need to deploy the implementation
  const transactions = [...extensions, wethTx].filter((e) => e !== null);
  if (transactions.length) {
    transactions.push({
      contractId: options.deployMetadata.name,
      type: "implementation",
    });
  }
  return transactions;
}

/**
 * Gets the default constructor parameters required for contract implementation deployment
 * @param args - The arguments object
 * @param args.chain - The blockchain network configuration
 * @param args.client - The ThirdwebClient instance
 * @returns An object containing default constructor parameters:
 * - On zkSync chains: returns an empty object since no parameters are needed
 * - On other chains: returns `trustedForwarder` and `nativeTokenWrapper` addresses
 *
 * @internal
 */
export async function getAllDefaultConstructorParamsForImplementation(args: {
  chain: Chain;
  client: ThirdwebClient;
  contractId: string;
  defaultExtensions?: DynamicContractExtension[];
}) {
  const { chain, client } = args;
  const isZkSync = await isZkSyncChain(chain);
  if (isZkSync) {
    const weth = ZKSYNC_WETH[chain.id];

    return {
      nativeTokenWrapper: weth,
    };
  }

  const forwarderContractId =
    args.contractId === "Pack" ? "ForwarderEOAOnly" : "Forwarder";
  const [forwarder, weth] = await Promise.all([
    computePublishedContractAddress({
      chain,
      client,
      contractId: forwarderContractId,
    }),
    computePublishedContractAddress({
      chain,
      client,
      contractId: "WETH9",
    }),
  ]);

  const defaultExtensionInput = args.defaultExtensions
    ? await generateExtensionInput({
        chain,
        client,
        defaultExtensions: args.defaultExtensions,
        forwarder,
        nativeTokenWrapper: weth,
      })
    : [];

  return {
    extensions: defaultExtensionInput,
    nativeTokenWrapper: weth,
    trustedForwarder: forwarder,
  };
}

async function generateExtensionInput(args: {
  defaultExtensions: DynamicContractExtension[];
  chain: Chain;
  client: ThirdwebClient;
  forwarder: string;
  nativeTokenWrapper: string;
}) {
  const { defaultExtensions, chain, client, forwarder, nativeTokenWrapper } =
    args;

  const deployedExtensions = await Promise.all(
    defaultExtensions.map((e) =>
      getDeployedInfraContract({
        chain,
        client,
        constructorParams: { forwarder, nativeTokenWrapper },
        contractId: e.extensionName,
        publisher: e.publisherAddress,
        version: e.extensionVersion || "latest",
      }).then((c) => ({
        implementation: c,
        metadataURI: "",
        name: e.extensionName,
      })),
    ),
  );

  const extensionInput = await Promise.all(
    deployedExtensions.map(async (e) => {
      if (!e.implementation) {
        throw new Error("Extension not deployed");
      }
      return resolveContractAbi(e.implementation)
        .then(generateExtensionFunctionsFromAbi)
        .then((c) => ({
          functions: c,
          metadata: {
            ...e,
            implementation: e.implementation?.address,
          },
        }));
    }),
  );

  return extensionInput;
}

export function generateExtensionFunctionsFromAbi(abi: Abi): Array<{
  functionSelector: `0x${string}`;
  functionSignature: string;
}> {
  const functions = abi.filter(
    (item) => item.type === "function" && !item.name.startsWith("_"),
  ) as AbiFunction[];

  return functions.map((fn) => ({
    functionSelector: toFunctionSelector(fn),
    functionSignature: toFunctionSignature(fn),
  }));
}
