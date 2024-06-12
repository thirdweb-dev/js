import type { TransactionSerializable } from "viem";
import type { Hex } from "../../utils/encoding/hex.js";
import { keccak256 } from "../../utils/hashing/keccak256.js";
import { sign } from "../../utils/signatures/sign.js";
import { serializeTransaction } from "../serialize-transaction.js";

export type SignTransactionOptions = {
  transaction: TransactionSerializable;
  privateKey: Hex;
  // TODO: Add optional custom serializer here
};

/**
 * Signs a transaction to be sent to a node.
 * @param options The options for signing.
 * @param options.transaction - The transaction object to sign
 * @param options.privateKey - The account private key
 * @returns The signed transaction as a hex string
 * @example
 * ```ts
 * import { signTransaction } from "thirdweb";
 * signTransaction({
 *   transaction: {
 *     ...
 *   },
 *   privateKey: "0x...",
 * });
 * ```
 * @transaction
 */
export function signTransaction({
  transaction,
  privateKey,
}: SignTransactionOptions): Hex {
  if (transaction.type === "eip4844") {
    transaction = { ...transaction, sidecars: false };
  }

  const serializedTransaction = serializeTransaction({ transaction });

  const signature = sign({
    hash: keccak256(serializedTransaction),
    privateKey: privateKey,
  });
  return serializeTransaction({
    transaction: { ...transaction, ...signature },
  });
}
