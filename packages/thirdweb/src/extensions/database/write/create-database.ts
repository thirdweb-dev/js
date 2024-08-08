import { getContract } from "../../../contract/contract.js";
import { prepareDeterministicDeployTransaction } from "../../../contract/deployment/deploy-deterministic.js";
import { sendAndConfirmTransaction } from "../../../transaction/actions/send-and-confirm-transaction.js";
import { prepareContractCall } from "../../../transaction/prepare-contract-call.js";
import { isContractDeployed } from "../../../utils/bytecode/is-contract-deployed.js";
import type { ClientAndChainAndAccount } from "../../../utils/types.js";
import { DEFAULT_DATABASE_FACTORY } from "../constants.js";

export type CreateDatabaseParams = ClientAndChainAndAccount & {
  name: string;
};

/**
 * Deploys an on-chain database with the provided name. The database admin is set to the deployer account.
 * @param param {CreateDatabaseOptions}
 * @param param.account {@link Account} The deployer account
 * @param param.chain {@link Chain} The chain to deploy the database on
 * @param param.client {@link ThirdwebClient} The thirdweb client to use
 * @param param.name {string} The name of the new database
 *
 * @note This function will also trigger factory deployment if the default factory does not yet exist on the provided chain
 * @throws If the database or factory deployment fails for any reason
 * @return {Promise<void>} A promise that will resolve when the database is fully deployed
 *
 * @example
 * ```ts
 * import { createDatabase } from "thirdweb/extensions/database";
 *
 * const databases = await createDatabase({
 *  chain: defineChain(1),
 *  client: thirdwebClient,
 *  account: activeAccount,
 *  name: "theranos"
 * });
 * ```
 * @beta
 * @extension Database
 */
export async function createDatabase({
  chain,
  client,
  account,
  name,
}: CreateDatabaseParams): Promise<void> {
  const databaseFactory = getContract({
    chain,
    client,
    address: DEFAULT_DATABASE_FACTORY,
  });

  const isFactoryDeployed = await isContractDeployed(databaseFactory);

  if (!isFactoryDeployed) {
    const deployFactoryTransaction = prepareDeterministicDeployTransaction({
      chain,
      client,
      contractId: "DatabaseFactory",
      constructorParams: [],
      publisher: "0x4a706de5CE9bfe2f9C37BA945805e396d1810824",
      // Excluded version to always use latest, but maybe we shouldn't?
    });

    const factoryDeploymentResult = await sendAndConfirmTransaction({
      account,
      transaction: deployFactoryTransaction,
    });

    if (factoryDeploymentResult.status !== "success") {
      throw new Error(
        "factoryDeploymentResult: Failed to deploy database factory",
      );
    }
  }

  const createDatabaseTransaction = prepareContractCall({
    contract: databaseFactory,
    method:
      "function createDatabase(string calldata databaseName, address _admin) public returns (address)",
    params: [name, account.address],
  });

  const createDatabaseResult = await sendAndConfirmTransaction({
    account,
    transaction: createDatabaseTransaction,
  });

  if (createDatabaseResult.status !== "success") {
    throw new Error(
      `createDatabase: Failed to create database ${name} with account ${account.address} `,
    );
  }
}
