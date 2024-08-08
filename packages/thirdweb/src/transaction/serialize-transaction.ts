import {
  type GetTransactionType,
  type SerializedTransactionReturnType,
  type Signature,
  type TransactionSerializable,
  type TransactionType,
  serializeTransaction as _serializeTransaction,
} from "viem";

export type SerializeTransactionOptions = {
  transaction: TransactionSerializable;
  signature?: Signature | undefined;
};

/**
 * Serializes a legacy, EIP-1559, EIP-2930, EIP-4844, or EIP-7702 transaction object.
 *
 * @param options - The serialization options.
 * @param options.transaction - The transaction object to be serialized.
 * @param [options.signature] - The signature to include with the transaction, if necessary.
 * @returns The serialized transaction.
 * @throws An error if the provided transaction object is invalid.
 * @transaction
 * @example
 * ```ts
 * import { serializeTransaction } from "thirdweb";
 *
 * const serializedTransaction = serializeTransaction({ transaction: {
 *    to: "0x",
 *    value: 0n,
 *  }
 * });
 * ```
 */
export function serializeTransaction<
  const transaction extends TransactionSerializable,
  _transactionType extends TransactionType = GetTransactionType<transaction>,
>(
  options: SerializeTransactionOptions,
): SerializedTransactionReturnType<transaction, _transactionType> {
  const { transaction } = options;

  // This is to maintain compatibility with our old interface (including the signature in the transaction object)
  const signature = (() => {
    if (options.signature) return options.signature;
    if (transaction.v === undefined && transaction.yParity === undefined) {
      return undefined;
    }

    if (transaction.r === undefined || transaction.s === undefined) {
      throw new Error("Invalid signature provided with transaction");
    }

    return {
      v: transaction.v,
      r: transaction.r,
      s: transaction.s,
      yParity: transaction.yParity,
    };
  })();

  return _serializeTransaction(transaction, signature as Signature | undefined); // Trust the options type-checking did its job and that the converted signature mirrors that type
}
