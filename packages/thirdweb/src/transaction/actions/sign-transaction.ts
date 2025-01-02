import * as ox__Hash from "ox/Hash";
import * as ox__Secp256k1 from "ox/Secp256k1";
import type { Hex } from "../../utils/encoding/hex.js";
import {
  type SerializableTransaction,
  serializeTransaction,
} from "../serialize-transaction.js";

export type SignTransactionOptions = {
  transaction: SerializableTransaction;
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
  const serializedTransaction = serializeTransaction({ transaction });

  const signature = ox__Secp256k1.sign({
    payload: ox__Hash.keccak256(serializedTransaction),
    privateKey: privateKey,
  });
  return serializeTransaction({
    transaction: { ...transaction, ...signature },
  });
}
