import { sendAndConfirmTransaction } from "../../../transaction/actions/send-and-confirm-transaction.js";
import type { FetchDeployMetadataResult } from "../../../utils/any-evm/deploy-metadata.js";
import { isZkSyncChain } from "../../../utils/any-evm/zksync/isZkSyncChain.js";
import type { ClientAndChainAndAccount } from "../../../utils/types.js";
import { type ThirdwebContract, getContract } from "../../contract.js";
import { fetchPublishedContractMetadata } from "../publisher.js";
import { zkDeployCreate2Factory } from "../zksync/zkDeployCreate2Factory.js";
import { zkDeployContractDeterministic } from "../zksync/zkDeployDeterministic.js";
import { getDeployedCloneFactoryContract } from "./clone-factory.js";
import {
  deployCreate2Factory,
  getDeployedCreate2Factory,
} from "./create-2-factory.js";
import {
  type InfraContractId,
  getDeployedInfraContract,
  getDeployedInfraContractFromMetadata,
  prepareInfraContractDeployTransactionFromMetadata,
} from "./infra.js";

/**
 * @internal
 */
export async function getOrDeployInfraForPublishedContract(
  args: ClientAndChainAndAccount & {
    contractId: string;
    constructorParams?: Record<string, unknown>;
    publisher?: string;
    version?: string;
  },
): Promise<{
  cloneFactoryContract: ThirdwebContract;
  implementationContract: ThirdwebContract;
}> {
  const {
    chain,
    client,
    account,
    contractId,
    constructorParams,
    publisher,
    version,
  } = args;

  if (isZkSyncChain(chain)) {
    const cloneFactoryContract = await zkDeployCreate2Factory({
      chain,
      client,
      account,
    });
    const compilerMetadata = await fetchPublishedContractMetadata({
      client,
      contractId: `${contractId}_ZkSync`, // different contract id for zkSync
      publisher,
      version,
    });
    const implementationContract = await zkDeployContractDeterministic({
      chain,
      client,
      account,
      abi: compilerMetadata.abi,
      bytecode: compilerMetadata.bytecode,
      params: constructorParams,
    });
    return {
      cloneFactoryContract: getContract({
        address: cloneFactoryContract,
        chain,
        client,
      }),
      implementationContract: getContract({
        address: implementationContract,
        chain,
        client,
      }),
    };
  }

  let [cloneFactoryContract, implementationContract] = await Promise.all([
    getDeployedCloneFactoryContract({
      chain,
      client,
    }),
    getDeployedInfraContract({
      chain,
      client,
      contractId,
      constructorParams,
      publisher,
      version,
    }),
  ]);

  if (!implementationContract || !cloneFactoryContract) {
    // deploy the infra and implementation contracts if not found
    cloneFactoryContract = await deployCloneFactory({
      client,
      chain,
      account,
    });
    implementationContract = await deployImplementation({
      client,
      chain,
      account,
      contractId,
      constructorParams,
      publisher,
      version,
    });
  }
  return { cloneFactoryContract, implementationContract };
}

/**
 * @internal
 * @returns the deployed clone factory contract
 */
export async function deployCloneFactory(options: ClientAndChainAndAccount) {
  // create2 factory
  const create2Factory = await getDeployedCreate2Factory(options);
  if (!create2Factory) {
    await deployCreate2Factory(options);
  }

  // Forwarder
  const forwarder = await getOrDeployInfraContract({
    ...options,
    contractId: "Forwarder",
  });

  // clone factory
  return getOrDeployInfraContract({
    ...options,
    contractId: "TWCloneFactory",
    constructorParams: { _trustedForwarder: forwarder.address },
  });
}

/**
 * @internal
 * @returns the deployed infra contract
 */
export async function deployImplementation(
  options: ClientAndChainAndAccount & {
    contractId: string;
    constructorParams?: Record<string, unknown>;
    publisher?: string;
    version?: string;
  },
) {
  return getOrDeployInfraContract({
    ...options,
    contractId: options.contractId,
    constructorParams: options.constructorParams,
    publisher: options.publisher,
    version: options.version,
  });
}

/**
 * Convenience function to get or deploy an infra contract
 * @internal
 */
export async function getOrDeployInfraContract(
  options: ClientAndChainAndAccount & {
    contractId: InfraContractId;
    constructorParams?: Record<string, unknown>;
    publisher?: string;
    version?: string;
  },
) {
  const contractMetadata = await fetchPublishedContractMetadata({
    client: options.client,
    contractId: options.contractId,
    publisher: options.publisher,
    version: options.version,
  });
  return getOrDeployInfraContractFromMetadata({
    account: options.account,
    chain: options.chain,
    client: options.client,
    constructorParams: options.constructorParams,
    contractMetadata,
  });
}

export async function getOrDeployInfraContractFromMetadata(
  options: ClientAndChainAndAccount & {
    contractMetadata: FetchDeployMetadataResult;
    constructorParams?: Record<string, unknown>;
  },
) {
  const infraContract = await getDeployedInfraContractFromMetadata(options);
  if (infraContract) {
    return infraContract;
  }
  const transaction =
    prepareInfraContractDeployTransactionFromMetadata(options);
  await sendAndConfirmTransaction({
    transaction,
    account: options.account,
  });
  const deployedInfraContract =
    await getDeployedInfraContractFromMetadata(options);
  if (!deployedInfraContract) {
    throw new Error(`Failed to deploy ${options.contractMetadata.name}`);
  }
  return deployedInfraContract;
}
