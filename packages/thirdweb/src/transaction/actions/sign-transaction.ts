import { sign } from "../../utils/signatures/sign.js";
import type { Hex } from "../../utils/encoding/hex.js";
import { keccak256 } from "../../utils/hashing/keccak256.js";
import { serializeTransaction, type TransactionSerializable } from "viem";

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
 */
export function signTransaction({
  transaction,
  privateKey,
  // TODO: Setup more advanced transaction result typing
}: SignTransactionOptions): Hex {
  // We don't need to worry about sidecars yet since we're on an older version of viem
  // TODO: Add eip4844 type check when upgrading viem past 2.8.0

  const serializedTransaction = serializeTransaction(transaction);

  const signature = sign({
    hash: keccak256(serializedTransaction),
    privateKey: privateKey,
  });
  return serializeTransaction(transaction, signature);
}
