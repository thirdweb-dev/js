import { sendAndConfirmTransaction } from "../../../transaction/actions/send-and-confirm-transaction.js";
import type { ClientAndChainAndAccount } from "../../../utils/types.js";
import {
  deployCreate2Factory,
  getDeployedCreate2Factory,
} from "./create-2-factory.js";
import {
  getDeployedInfraContract,
  prepareInfraContractDeployTransaction,
  type InfraContractId,
} from "./infra.js";

/**
 * @internal
 */
export async function bootstrapOnchainInfra(options: ClientAndChainAndAccount) {
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
  await getOrDeployInfraContract({
    ...options,
    contractId: "TWCloneFactory",
    constructorParams: [forwarder.address],
  });
}

/**
 * @internal
 */
export async function bootstrapImplementation(
  options: ClientAndChainAndAccount & {
    contractId: string;
    constructorParams?: unknown[];
    publisher?: string;
    version?: string;
  },
) {
  await getOrDeployInfraContract({
    ...options,
    contractId: options.contractId,
    constructorParams: options.constructorParams || [],
    publisher: options.publisher,
    version: options.version,
  });
}

/**
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
