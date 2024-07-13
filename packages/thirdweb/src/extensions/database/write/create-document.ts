import type { ThirdwebContract } from "../../../contract/contract.js";
import { upload } from "../../../storage/upload.js";
import { sendAndConfirmTransaction } from "../../../transaction/actions/send-and-confirm-transaction.js";
import { prepareContractCall } from "../../../transaction/prepare-contract-call.js";
import { stringify } from "../../../utils/json.js";
import { randomBytesHex } from "../../../utils/random.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";

export type CreateDocumentParams = {
  database: ThirdwebContract;
  collection: string;
  account: Account;
};

/**
 * Creates a new document in the provided collection and database
 * @param data {Record<string, unknown>} - The data to store as a JSON object
 * @param params {@link CreateDocumentParams}
 * @param params.database {@link ThirdwebClient} - The database to add the new collection to
 * @param params.collection {string} - The collection to add the document to
 * @param params.account {@link Account} - The account to create the document with
 *
 * @returns {Promise<void>} A promise that resolves when the transaction is complete
 *
 * @example
 * ```ts
 * import { createDocument, FieldType, FieldStatus } from "thirdweb/extensions/database";
 * import { getContract } from "thirdweb";
 *
 * const database = getContract({
 *  chain,
 *  client,
 *  address: "0x..."
 * });
 *
 * const user = {
 *   username: "alice"
 * };
 *
 * await createDocument(user, {
 *  database,
 *  collectionName: "users",
 *  account
 * });
 * ```
 *
 * @beta
 * @extension Database
 */
export async function createDocument(
  data: Record<string, unknown>,
  { database, collection, account }: CreateDocumentParams,
): Promise<void> {
  const uri = await upload({
    client: database.client,
    files: [new File([stringify(data)], `${randomBytesHex(4)}.json`)],
  });

  const createDocumentTransaction = prepareContractCall({
    contract: database,
    method:
      "function createDocument(string calldata collectionName, string calldata document)",
    params: [collection, uri],
  });

  await sendAndConfirmTransaction({
    account,
    transaction: createDocumentTransaction,
  });
}
