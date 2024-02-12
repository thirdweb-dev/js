import { keccak256, type Hex, stringToBytes } from "viem";

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
export function keccackId(input: string): Hex {
  return keccak256(stringToBytes(input));
}
