import { keccak256, toBytes, type Hex } from "viem";

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
export function keccackId(input: string | number | bigint | boolean): Hex {
  return keccak256(toBytes(input));
}
