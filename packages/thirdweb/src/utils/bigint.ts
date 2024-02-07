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
