import { sendAndConfirmTransaction } from "../../../transaction/actions/send-and-confirm-transaction.js";
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
  prepareInfraContractDeployTransaction,
} from "./infra.js";

/**
 * @internal
 */
export async function getOrDeployInfraForPublishedContract(
  args: ClientAndChainAndAccount & {
    contractId: string;
    constructorParams: unknown[];
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
    const { compilerMetadata } = await fetchPublishedContractMetadata({
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
    constructorParams: [],
  });

  // clone factory
  return getOrDeployInfraContract({
    ...options,
    contractId: "TWCloneFactory",
    constructorParams: [forwarder.address],
  });
}

/**
 * @internal
 * @returns the deployed infra contract
 */
export async function deployImplementation(
  options: ClientAndChainAndAccount & {
    contractId: string;
    constructorParams?: unknown[];
    publisher?: string;
    version?: string;
  },
) {
  return getOrDeployInfraContract({
    ...options,
    contractId: options.contractId,
    constructorParams: options.constructorParams || [],
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
    constructorParams: unknown[];
    publisher?: string;
    version?: string;
  },
) {
  const infraContract = await getDeployedInfraContract(options);
  if (infraContract) {
    return infraContract;
  }
  const transaction = prepareInfraContractDeployTransaction(options);
  await sendAndConfirmTransaction({
    transaction,
    account: options.account,
  });
  const deployedInfraContract = await getDeployedInfraContract(options);
  if (!deployedInfraContract) {
    throw new Error(`Failed to deploy ${options.contractId}`);
  }
  return deployedInfraContract;
}
