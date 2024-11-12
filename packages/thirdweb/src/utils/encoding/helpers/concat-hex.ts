import * as ox__Hex from "ox/Hex";
import type { Hex } from "../hex.js";

/**
 * Concatenates an array of hexadecimal values into a single hexadecimal value.
 *
 * @param values - An array of hexadecimal values to concatenate.
 * @returns The concatenated hexadecimal value.
 * @utils
 */
export function concatHex(values: readonly Hex[]): Hex {
  return ox__Hex.concat(...values);
}
