import { uint8ArrayToHex } from "./encoding/hex.js";

/**
 * Returns the minimum of two BigInt values.
 * @param a - The first BigInt value.
 * @param b - The second BigInt value.
 * @returns The smaller of the two BigInt values.
 * @example
 * ```ts
 * min(1n, 2n)
 * // 1n
 */
export function min(a: bigint, b: bigint) {
  return a < b ? a : b;
}

/**
 * Returns the maximum of two BigInt values.
 * @param a - The first BigInt value.
 * @param b - The second BigInt value.
 * @returns The larger of the two BigInt values.
 * @example
 * ```ts
 * max(1n, 2n)
 * // 2n
 */
export function max(a: bigint, b: bigint) {
  return a > b ? a : b;
}

/**
 * Provides error checking on string or number bigint inputs.
 * @param value - A possibly integer-like string, number, or bigint.
 * @returns The bigint representation of the input.
 * @example
 * ```ts
 * toBigInt("2")
 * // 2n
 */
export function toBigInt(value: string | number | bigint | Uint8Array): bigint {
  if (
    ["string", "number"].includes(typeof value) &&
    !Number.isInteger(Number(value))
  ) {
    throw new Error(
      `Expected value to be an integer to convert to a bigint, got ${value} of type ${typeof value}`,
    );
  }

  if (value instanceof Uint8Array) {
    return BigInt(uint8ArrayToHex(value));
  }

  return BigInt(value);
}
