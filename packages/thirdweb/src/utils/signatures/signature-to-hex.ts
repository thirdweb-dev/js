import { secp256k1 } from "@noble/curves/secp256k1";
import type { Signature } from "viem";
import { type Hex, hexToBigInt } from "../encoding/hex.js";

/**
 * Converts a signature to a hex string.
 * @param signature The signature to convert.
 * @returns The hex string representation of the signature.
 * @example
 * ```ts
 * import { signatureToHex } from "thirdweb/utils";
 *
 * const hex = signatureToHex({
 * r: toHex(
 * 49782753348462494199823712700004552394425719014458918871452329774910450607807n,
 * ),
 * s: toHex(
 * 33726695977844476214676913201140481102225469284307016937915595756355928419768n,
 * ),
 * v: 28n,
 * });
 *
 * console.log(hex);
 * // "0x6e100a352ec6ad1b70802290e18aeed190704973570f3b8ed42cb9808e2ea6bf4a90a229a244495b41890987806fcbd2d5d23fc0dbe5f5256c2613c039d76db81c"
 * ```
 * @utils
 */
export function signatureToHex(signature: Signature): Hex {
  const { r, s, v, yParity } = signature;
  const yParity_ = (() => {
    if (yParity === 0 || yParity === 1) return yParity;
    if (v && (v === 27n || v === 28n || v >= 35n)) return v % 2n === 0n ? 1 : 0;
    throw new Error("Invalid `v` or `yParity` value");
  })();
  return `0x${new secp256k1.Signature(
    hexToBigInt(r),
    hexToBigInt(s),
  ).toCompactHex()}${yParity_ === 0 ? "1b" : "1c"}`;
}
