import type { ThirdwebContract } from "../../../contract/contract.js";
import { sendAndConfirmTransaction } from "../../../transaction/actions/send-and-confirm-transaction.js";
import { prepareContractCall } from "../../../transaction/prepare-contract-call.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";
import type { CollectionSchema } from "../types.js";

export type CreateCollectionParams = {
  database: ThirdwebContract;
  name: string;
  schema: CollectionSchema;
  account: Account;
};

const METHOD_ABI = {
  type: "function" as const,
  name: "createCollection",
  inputs: [
    {
      name: "collectionName",
      type: "string",
      internalType: "string",
    },
    {
      name: "schema",
      type: "tuple[]",
      internalType: "struct Collection.Field[]",
      components: [
        {
          name: "name",
          type: "string",
          internalType: "string",
        },
        {
          name: "keyType",
          type: "uint8",
          internalType: "enum Collection.Type",
        },
        {
          name: "fieldStatuses",
          type: "uint8[]",
          internalType: "enum Collection.FieldStatus[]",
        },
        {
          name: "defaultValue",
          type: "string",
          internalType: "string",
        },
      ],
    },
  ],
  outputs: [],
  stateMutability: "nonpayable",
} as const;

/**
 * Creates a new collection in the provided database
 * @param params {@link CreateCollectionParams}
 * @param params.database {@link ThirdwebClient} The database to add the new collection to
 * @param params.name {string} The name for the new collection
 * @param params.schema {@link CollectionSchema} The new collection's schema
 * @param params.account {@link Account} The admin account to create the collection with
 *
 * @throws When the account is not admin on the database
 * @returns {Promise<void>} A promise that resolves when the transaction is complete
 *
 * @example
 * ```ts
 * import { createCollection, FieldType, FieldStatus } from "thirdweb/extensions/database";
 * import { getContract } from "thirdweb";
 *
 * const database = getContract({
 *  chain,
 *  client,
 *  address: "0x..."
 * });
 *
 * await createCollection({
 *  database,
 *  name: "users",
 *  schema: [{ name: "username", type: FieldType.STRING, status: [FieldStatus.INDEXED]}],
 *  account
 * });
 * ```
 *
 * @beta
 * @extension Database
 */
export async function createCollection({
  database,
  name,
  schema,
  account,
}: CreateCollectionParams): Promise<void> {
  const parsedSchema = schema.map((field) => ({
    name: field.name,
    keyType: field.type,
    fieldStatuses: field.status,
    defaultValue: field.defaultValue ?? "",
  }));

  const createCollectionTransaction = prepareContractCall({
    contract: database,
    method: METHOD_ABI,
    params: [name, parsedSchema],
  });

  await sendAndConfirmTransaction({
    account,
    transaction: createCollectionTransaction,
  });
}
