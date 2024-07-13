import type { Chain } from "../../../chains/types.js";
import type { ThirdwebClient } from "../../../client/client.js";
import {
  type ThirdwebContract,
  getContract,
} from "../../../contract/contract.js";
import { readContract } from "../../../transaction/read-contract.js";
import { isAddress } from "../../../utils/address.js";
import { isContractDeployed } from "../../../utils/bytecode/is-contract-deployed.js";
import { DEFAULT_DATABASE_FACTORY } from "../constants.js";

export type GetDatabasesParams = {
  ownerAddress: string;
  chain: Chain;
  client: ThirdwebClient;
};

/**
 * Retrieves on-chain database contracts for the provided owner address
 * @param params {GetDatabaseParams}
 * @param params.ownerAddress {string} The address to receive owned databases for
 * @param params.chain {@link Chain} The chain to retrieve databases for
 * @param params.client {@link ThirdwebClient} The thirdweb client to use
 *
 * @return {Promise<string[]>} A promise resolving to an array of database addresses
 *
 * @example
 * ```ts
 * import { getDatabases } from "thirdweb/extensions/database";
 *
 * const databases = await getDatabases({
 *  ownerAddress: "0x...",
 *  chain: defineChain(1),
 *  client: thirdwebClient
 * });
 * ```
 * @beta
 * @extension Database
 */
export async function getDatabases({
  ownerAddress,
  chain,
  client,
}: GetDatabasesParams) {
  if (!isAddress(ownerAddress)) {
    throw new Error(`getDatabases: Invalid ownerAddress ${ownerAddress}`);
  }

  const databaseFactory: ThirdwebContract = getContract({
    chain,
    client,
    address: DEFAULT_DATABASE_FACTORY,
  });

  const isFactoryDeployed = await isContractDeployed(databaseFactory);

  if (isFactoryDeployed) {
    return readContract({
      contract: databaseFactory,
      method:
        "function getUserDatabase(address user) public view returns (address[])",
      params: [ownerAddress],
    });
  }

  // If the factory is not deployed on this chain, they have no databases
  return [];
}
