import type { ThirdwebContract } from "../../../contract/contract.js";
import { download } from "../../../storage/download.js";
import { readContract } from "../../../transaction/read-contract.js";

export type GetDocumentParams = {
  database: ThirdwebContract;
  collection: string;
};

/**
 * Retrieves a document by a specified ID
 * @param id {number} The document ID
 * @param params {@link GetCollectionParams}
 * @param params.database {@link ThirdwebContract} The database contract
 * @param params.collection {string} The collection to retrieve the document from
 *
 * @returns {Promise<unknown>} A promise that resolves to the document
 *
 * @example
 * ```ts
 * import { getDocument } from "thirdweb/extensions/database";
 * import { getContract } from "thirdweb";
 *
 * const database = getContract({
 *  chain,
 *  client,
 *  address: "0x..."
 * });
 *
 * const document = await getDocument(0, { database, "users" });
 * ```
 *
 * @beta
 * @extension Database
 */
export async function getDocument(
  id: number,
  { database, collection }: GetDocumentParams,
): Promise<string[]> {
  const uri = await readContract({
    contract: database,
    method:
      "function getDocument(string, uint256) public view returns (string)",
    params: [collection, BigInt(id)],
  });

  const response = await download({
    client: database.client,
    uri,
  });

  if (response.status !== 200) {
    throw new Error(`Failed to fetch document with ID ${id} with uri ${uri}`);
  }

  return response.json();
}
