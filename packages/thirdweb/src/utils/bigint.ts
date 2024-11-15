import { uint8ArrayToHex } from "./encoding/hex.js";

/**
 * Returns the minimum of two BigInt values.
 * @param a - The first BigInt value.
 * @param b - The second BigInt value.
 * @returns The smaller of the two BigInt values.
 * @utils
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
 * @utils
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

// replaceBigInts courtesy of ponder.sh:
// https://github.com/ponder-sh/ponder/blob/bc65b865898b6145e87031314192c59f9e8b621f/packages/utils/src/replaceBigInts.ts
type _ReplaceBigInts<
  arr extends readonly unknown[],
  type,
  result extends readonly unknown[] = [],
> = arr extends [infer first, ...infer rest]
  ? _ReplaceBigInts<
      rest,
      type,
      readonly [...result, first extends bigint ? type : first]
    >
  : result;

type ReplaceBigInts<obj, type> = obj extends bigint
  ? type
  : obj extends unknown[]
    ? _ReplaceBigInts<Readonly<obj>, type>
    : obj extends readonly []
      ? _ReplaceBigInts<obj, type>
      : obj extends object
        ? { [key in keyof obj]: ReplaceBigInts<obj[key], type> }
        : obj;

export const replaceBigInts = <const T, const type>(
  obj: T,
  replacer: (x: bigint) => type,
): ReplaceBigInts<T, type> => {
  if (typeof obj === "bigint") return replacer(obj) as ReplaceBigInts<T, type>;
  if (Array.isArray(obj))
    return obj.map((x) => replaceBigInts(x, replacer)) as ReplaceBigInts<
      T,
      type
    >;
  if (obj && typeof obj === "object")
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, replaceBigInts(v, replacer)]),
    ) as ReplaceBigInts<T, type>;
  return obj as ReplaceBigInts<T, type>;
};
