import { sha256 as noble_sha256 } from "@noble/hashes/sha256";
import {
  type Hex,
  hexToUint8Array,
  isHex,
  uint8ArrayToHex,
} from "../encoding/hex.js";

type To = "hex" | "bytes";

export type Sha256Hash<TTo extends To> =
  | (TTo extends "bytes" ? Uint8Array : never)
  | (TTo extends "hex" ? Hex : never);

/**
 * Calculates the SHA256 hash of the given value.
 * @param value - The value to hash. It can be either a hexadecimal string or a Uint8Array.
 * @param to - (Optional) The desired output format of the hash. Defaults to 'hex'.
 * @returns The SHA256 hash of the value in the specified format.
 * @example
 * ```ts
 * import { sha256 } from "thirdweb/utils";
 * const hash = sha256("0x1234");
 * ```
 * @utils
 */
export function sha256<TTo extends To = "hex">(
  value: Hex | Uint8Array,
  to?: TTo,
): Sha256Hash<TTo> {
  const bytes = noble_sha256(
    isHex(value, { strict: false }) ? hexToUint8Array(value) : value,
  );
  if (to === "bytes") {
    return bytes as Sha256Hash<TTo>;
  }
  return uint8ArrayToHex(bytes) as Sha256Hash<TTo>;
}
