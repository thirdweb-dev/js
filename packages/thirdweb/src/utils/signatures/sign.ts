import { secp256k1 } from "@noble/curves/secp256k1";
import type { Signature } from "viem";

import { type Hex, toHex } from "../encoding/hex.js";

/**
 * Options for signing a transaction hash.
 */
export type SignOptions = {
  hash: Hex;
  privateKey: Hex;
};

/**
 * Generates the signature for the provided transaction hash.
 * @param options - The options for signing.
 * @param options.hash - The hash to be signed.
 * @param options.privateKey - The private key to sign the hash with.
 * @returns The transaction signature.
 * @example
 * ```ts
 * import { sign } from "thirdweb/utils";
 *
 * const signature = sign({
 *   hash: "0x",
 *   privateKey: "0x",
 * });
 * ```
 * @utils
 */
export function sign({ hash, privateKey }: SignOptions): Signature {
  const { r, s, recovery } = secp256k1.sign(hash.slice(2), privateKey.slice(2));
  return {
    r: toHex(r),
    s: toHex(s),
    v: recovery ? 28n : 27n,
    yParity: recovery,
  };
}
