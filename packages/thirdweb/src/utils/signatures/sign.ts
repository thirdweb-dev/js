import type { Signature } from "viem";
import { secp256k1 } from "@noble/curves/secp256k1";

import { toHex, type Hex } from "../encoding/hex.js";

/**
 * @description Options for signing a transaction hash.
 */
export type SignOptions = {
  hash: Hex;
  privateKey: Hex;
};

/**
 * @description Generates the signature for the provided transaction hash.
 *
 * @param hash - The hash to be signed.
 * @param privateKey - The private key to sign the hash with.
 *
 * @returns The transaction signature.
 *
 * @example
 * ```ts
 * import { sign } from "thirdweb/utils";
 *
 * const signature = sign({
 *   hash: "0x",
 *   privateKey: "0x",
 * });
 */
export function sign(options: SignOptions): Signature {
  const { r, s, recovery } = secp256k1.sign(
    options.hash.slice(2),
    options.privateKey.slice(2),
  );
  return {
    r: toHex(r),
    s: toHex(s),
    v: recovery ? 28n : 27n,
  };
}
