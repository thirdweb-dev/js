import { keccak_256 } from "@noble/hashes/sha3";
import {
  isHex,
  type Hex,
  hexToUint8Array,
  uint8ArrayToHex,
} from "../encoding/hex.js";

type To = "hex" | "bytes";

export type Keccak256Hash<TTo extends To> =
  | (TTo extends "bytes" ? Uint8Array : never)
  | (TTo extends "hex" ? Hex : never);

/**
 * Calculates the Keccak-256 hash of the given value.
 * @param value - The value to hash, either as a hexadecimal string or a Uint8Array.
 * @param to - The desired output format of the hash (optional). Defaults to 'hex'.
 * @returns The Keccak-256 hash of the value in the specified format.
 * @example
 * ```ts
 * import { keccak256 } from "thirdweb/utils";
 * const hash = keccak256("0x1234");
 * ```
 */
export function keccak256<TTo extends To = "hex">(
  value: Hex | Uint8Array,
  to?: TTo,
): Keccak256Hash<TTo> {
  const bytes = keccak_256(
    isHex(value, { strict: false }) ? hexToUint8Array(value) : value,
  );
  if (to === "bytes") {
    return bytes as Keccak256Hash<TTo>;
  }
  // default fall through to hex
  return uint8ArrayToHex(bytes) as Keccak256Hash<TTo>;
}
