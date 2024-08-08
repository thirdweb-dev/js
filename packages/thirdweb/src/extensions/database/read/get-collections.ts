import type { ThirdwebContract } from "../../../contract/contract.js";
import { readContract } from "../../../transaction/read-contract.js";

export type GetCollectionsParams = {
  database: ThirdwebContract;
};

/**
 * Retrieves all collection names in a given database
 * @param params {@link GetCollectionParams}
 * @param params.databse {@link ThirdwebContract} The database contract to retrieve collections for
 *
 * @returns {Promise<string[]>} A promise that resolves to the array of collection names
 *
 * @example
 * ```ts
 * import { getCollections } from "thirdweb/extensions/database";
 * import { getContract } from "thirdweb";
 *
 * const database = getContract({
 *  chain,
 *  client,
 *  address: "0x..."
 * });
 *
 * const collections = await getCollections({ database });
 * ```
 *
 * @beta
 * @extension Database
 */
export async function getCollections({
  database,
}: GetCollectionsParams): Promise<string[]> {
  const collections = await readContract({
    contract: database,
    method: "function getCollectionNames() public view returns (string[])",
    params: [],
  });

  return [...collections];
}
