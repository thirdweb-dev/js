import type { Chain } from "../../chains/types.js";
import type { ThirdwebClient } from "../../client/client.js";
import { getDeployedCreate2Factory } from "../../contract/deployment/utils/create-2-factory.js";
import { getDeployedInfraContract } from "../../contract/deployment/utils/infra.js";
import { getDeployedInfraContractFromMetadata } from "../../contract/deployment/utils/infra.js";
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
              : ({ type: "infra", contractId: "Create2Factory" } as const),
          ),
      isZkSync
        ? null
        : getDeployedInfraContract({
            chain,
            client,
            contractId: "Forwarder",
          }).then((c) =>
            c ? null : ({ type: "infra", contractId: "Forwarder" } as const),
          ),
      isZkSync
        ? null
        : getDeployedInfraContract({
            chain,
            client,
            contractId: "TWCloneFactory",
            constructorParams: {
              _trustedForwarder: await computePublishedContractAddress({
                chain,
                client,
                contractId: "Forwarder",
              }),
            },
          }).then((c) =>
            c
              ? null
              : ({ type: "infra", contractId: "TWCloneFactory" } as const),
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
                type: "module",
                contractId: m.deployMetadata.name,
              } as const),
        ),
      ),
    ]);
    results.push({ type: "proxy", contractId: deployMetadata.name });
    return results.flat().filter((r) => r !== null);
  }

  return [{ type: "implementation", contractId: deployMetadata.name }];
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
    return getTransactionsForMaketplaceV3(options);
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
    contractId: deployMetadata.name,
    constructorParams,
    publisher: deployMetadata.publisher,
    version: deployMetadata.version,
  }).then((c) =>
    c
      ? null
      : ({
          type: "implementation",
          contractId: deployMetadata.name,
        } as const),
  );
  return result ? [result] : [];
}

async function getTransactionsForMaketplaceV3(options: {
  chain: Chain;
  client: ThirdwebClient;
}): Promise<DeployTransactionResult[]> {
  const { chain, client } = options;
  const WETHAdress = await computePublishedContractAddress({
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
      c ? null : ({ type: "infra", contractId: "WETH9" } as const),
    ),
    getDeployedInfraContract({
      chain,
      client,
      contractId: "DirectListingsLogic",
      constructorParams: { _nativeTokenWrapper: WETHAdress },
    }).then((c) =>
      c
        ? null
        : ({ type: "extension", contractId: "DirectListingsLogic" } as const),
    ),
    getDeployedInfraContract({
      chain,
      client,
      contractId: "EnglishAuctionsLogic",
      constructorParams: { _nativeTokenWrapper: WETHAdress },
    }).then((c) =>
      c
        ? null
        : ({ type: "extension", contractId: "EnglishAuctionsLogic" } as const),
    ),
    getDeployedInfraContract({
      chain,
      client,
      contractId: "OffersLogic",
    }).then((c) =>
      c ? null : ({ type: "extension", contractId: "OffersLogic" } as const),
    ),
  ]);
  // hacky assumption: if we need to deploy any of the extensions, we also need to deploy the implementation
  const transactions = extensions.filter((e) => e !== null);
  if (transactions.length) {
    transactions.push({ type: "implementation", contractId: "MarketplaceV3" });
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
  return {
    trustedForwarder: forwarder,
    nativeTokenWrapper: weth,
  };
}
