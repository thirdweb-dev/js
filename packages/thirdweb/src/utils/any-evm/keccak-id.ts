import { keccak256 } from "../hashing/keccak256.js";
import type { Hex } from "../encoding/hex.js";
import { stringToBytes } from "../encoding/to-bytes.js";

/**
 * Calculates the keccak ID of the given input.
 * @param input - The input value to calculate the keccak ID for.
 * @returns The keccak ID as a Hex string.
 * @example
 * ```ts
 * import { keccackId } from "thirdweb/utils";
 * const keccakId = keccackId(input);
 * ```
 */
export function keccakId(input: string): Hex {
  return keccak256(stringToBytes(input));
}
