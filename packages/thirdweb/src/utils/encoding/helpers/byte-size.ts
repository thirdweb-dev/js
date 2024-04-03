import { isHex, type Hex } from "./is-hex.js";

/**
 * Calculates the byte size of a Hex string or Uint8Array.
 * If the value is a Hex string, it accounts for the leading "0x" prefix.
 * @param value The Hex string or Uint8Array.
 * @returns The byte size of the value.
 * @example
 * ```ts
 * import { byteSize } from "thirdweb/utils";
 * const size = byteSize("0x1a4");
 * console.log(size); // 2
 * ```
 */
export function byteSize(value: Hex | Uint8Array) {
  if (isHex(value, { strict: false })) {
    return Math.ceil((value.length - 2) / 2);
  }
  return value.length;
}
