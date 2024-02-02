import { encodeAbiFunction } from "~thirdweb/abi/encode.js";
import type { AbiFunction } from "abitype";
import type { Transaction } from "../transaction.js";
import { resolveAbiFunction } from "./resolve-abi.js";
import type { Hex } from "viem";
import { resolveParams } from "./resolve-params.js";

const ENCODE_CACHE = new WeakMap();

/**
 * Encodes a transaction object into a hexadecimal string representation of the encoded data.
 * @param tx - The transaction object to encode.
 * @returns A promise that resolves to the encoded data as a hexadecimal string.
 * @example
 * ```ts
 * import { encode } from "thirdweb";
 * const encodedData = await encode(tx);
 * ```
 */
export async function encode<const abiFn extends AbiFunction>(
  tx: Transaction<abiFn>,
): Promise<Hex> {
  if (ENCODE_CACHE.has(tx)) {
    return ENCODE_CACHE.get(tx) as Hex;
  }

  const encodePromise = (async () => {
    const [abiFn, { params }] = await Promise.all([
      resolveAbiFunction(tx),
      resolveParams(tx),
    ]);

    // @ts-expect-error - this works fine, dig into why later
    return encodeAbiFunction(abiFn, params ?? []);
  })();

  ENCODE_CACHE.set(tx, encodePromise);
  return encodePromise;
}
