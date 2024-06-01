import type { Hex } from "./is-hex.js";

/**
 * Concatenates an array of hexadecimal values into a single hexadecimal value.
 *
 * @param values - An array of hexadecimal values to concatenate.
 * @returns The concatenated hexadecimal value.
 * @utils
 */
export function concatHex(values: readonly Hex[]): Hex {
  return `0x${(values as Hex[]).reduce(
    (acc, x) => acc + x.replace("0x", ""),
    "",
  )}`;
}
