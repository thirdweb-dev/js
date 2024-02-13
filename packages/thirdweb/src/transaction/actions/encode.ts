import type { Hex } from "viem";
import type { PreparedTransaction } from "../transaction.js";

/**
 * Encodes a transaction object into a hexadecimal string representation of the encoded data.
 * @param transaction - The transaction object to encode.
 * @returns A promise that resolves to the encoded data as a hexadecimal string.
 * @transaction
 * @example
 * ```ts
 * import { encode } from "thirdweb";
 * const encodedData = await encode(transaction);
 * ```
 */
export async function encode(transaction: PreparedTransaction): Promise<Hex> {
  if (transaction.data === undefined) {
    return "0x";
  }
  if (typeof transaction.data === "function") {
    const data = await transaction.data();
    if (!data) {
      return "0x";
    }

    return data;
  }
  return transaction.data;
}
