import type { AbiFunction } from "abitype";
import type { Transaction } from "../transaction.js";
import { resolveAbiFunction } from "./resolve-abi.js";
import type { Hex } from "viem";
import { encodeRaw } from "./raw/raw-encode.js";

const ENCODE_CACHE = new WeakMap();

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
export async function encode<const abiFn extends AbiFunction>(
  transaction: Transaction<abiFn>,
): Promise<Hex> {
  if (ENCODE_CACHE.has(transaction)) {
    return ENCODE_CACHE.get(transaction) as Hex;
  }

  const encodePromise = (async () => {
    const abiFunction = await resolveAbiFunction(transaction);

    return encodeRaw({
      transaction,
      abiFunction: abiFunction as abiFn,
    });
  })();

  ENCODE_CACHE.set(transaction, encodePromise);
  return encodePromise;
}
