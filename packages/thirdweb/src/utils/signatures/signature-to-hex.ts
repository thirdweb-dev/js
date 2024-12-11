import * as ox__Hex from "ox/Hex";
import * as ox__Signature from "ox/Signature";
import type { Hex } from "../encoding/hex.js";

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
export function signatureToHex(signature: {
  r: Hex;
  s: Hex;
  v?: bigint | number | Hex | undefined;
  yParity?: bigint | number | Hex | undefined;
}): Hex {
  const { r, s, v, yParity } = signature;
  return ox__Signature.toHex(
    ox__Signature.from(
      typeof yParity !== "undefined"
        ? {
            r,
            s,
            yParity: !ox__Hex.validate(yParity)
              ? ox__Hex.fromNumber(yParity)
              : yParity,
          }
        : {
            r,
            s,
            v:
              !ox__Hex.validate(v) && typeof v !== "undefined"
                ? ox__Hex.fromNumber(v)
                : v,
          },
    ),
  );
}
