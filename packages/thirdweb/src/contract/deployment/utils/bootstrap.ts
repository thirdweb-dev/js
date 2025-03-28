import { activateStylusContract } from "../../../extensions/stylus/write/activateStylusContract.js";
import { sendAndConfirmTransaction } from "../../../transaction/actions/send-and-confirm-transaction.js";
import { sendTransaction } from "../../../transaction/actions/send-transaction.js";
import {
  type FetchDeployMetadataResult,
  fetchBytecodeFromCompilerMetadata,
} from "../../../utils/any-evm/deploy-metadata.js";
import { isZkSyncChain } from "../../../utils/any-evm/zksync/isZkSyncChain.js";
import type { ClientAndChainAndAccount } from "../../../utils/types.js";
import { type ThirdwebContract, getContract } from "../../contract.js";
import { fetchPublishedContractMetadata } from "../publisher.js";
import {
  ZKSYNC_IMPLEMENTATIONS,
  ZKSYNC_WETH,
} from "../zksync/implementations.js";
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
 * Gets or deploys the infrastructure contracts needed for a published contract deployment
 * @param args - The arguments object
 * @param args.chain - The blockchain network configuration
 * @param args.client - The ThirdwebClient instance
 * @param args.account - The account performing the deployment
 * @param args.contractId - The ID of the contract to deploy
 * @param args.constructorParams - Optional constructor parameters for the implementation contract
 * @param args.publisher - Optional publisher address, defaults to thirdweb
 * @param args.version - Optional version of the contract to deploy
 * @returns An object containing:
 * - cloneFactoryContract: The factory contract used for creating clones
 * - implementationContract: The deployed implementation contract
 * @contract
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

  if (await isZkSyncChain(chain)) {
    const cloneFactoryContract = await zkDeployCreate2Factory({
      chain,
      client,
      account,
    });
    const compilerMetadata = await fetchPublishedContractMetadata({
      client,
      contractId,
      publisher,
      version,
    });

    const zksyncImplementations = ZKSYNC_IMPLEMENTATIONS[chain.id];
    let implementationContract: string | undefined;

    if (zksyncImplementations) {
      implementationContract = zksyncImplementations[contractId];
    }

    if (!implementationContract) {
      implementationContract = await zkDeployContractDeterministic({
        chain,
        client,
        account,
        abi: compilerMetadata.abi,
        bytecode: await fetchBytecodeFromCompilerMetadata({
          compilerMetadata,
          client,
          chain,
        }),
        params: constructorParams,
      });
    }

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

  return {
    cloneFactoryContract,
    implementationContract,
  };
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
  if (options.contractId === "WETH9" && (await isZkSyncChain(options.chain))) {
    const weth = ZKSYNC_WETH[options.chain.id];

    if (weth) {
      return getContract({
        client: options.client,
        chain: options.chain,
        address: weth,
      });
    }
  }

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

  const isStylus = options.contractMetadata.metadata.language === "rust";
  if (isStylus) {
    try {
      const activationTransaction = await activateStylusContract({
        chain: options.chain,
        client: options.client,
        contractAddress: deployedInfraContract.address,
      });

      await sendTransaction({
        transaction: activationTransaction,
        account: options.account,
      });
    } catch {
      console.error("Error: Contract could not be activated.");
    }
  }

  return deployedInfraContract;
}
