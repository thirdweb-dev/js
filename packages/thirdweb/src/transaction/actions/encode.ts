import type { Hex } from "../../utils/encoding/hex.js";
import type { PreparedTransaction } from "../prepare-transaction.js";
import type { Abi, AbiFunction } from "abitype";

const encodeWeakMap = new WeakMap<
  PreparedTransaction<Abi, AbiFunction>,
  Promise<Hex>
>();

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
export async function encode<abi extends Abi, abiFn extends AbiFunction>(
  transaction: PreparedTransaction<abi, abiFn>,
): Promise<Hex> {
  if (encodeWeakMap.has(transaction)) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return encodeWeakMap.get(transaction)!;
  }
  const promise = (async () => {
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
  })();
  encodeWeakMap.set(transaction, promise);
  return promise;
}
