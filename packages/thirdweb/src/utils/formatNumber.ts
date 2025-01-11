/**
 * Round up a number to a certain decimal place
 * @example
 * ```ts
 * import { formatNumber } from "thirdweb/utils";
 * const value = formatNumber(12.1214141, 1); // 12.1
 * ```
 * @utils
 */
export function formatNumber(value: number, decimalPlaces: number) {
  if (value === 0) return 0;
  const precision = 10 ** decimalPlaces;
  const threshold = 1 / 10 ** decimalPlaces; // anything below this if rounded will result in zero - so use ceil instead
  const fn: "ceil" | "round" = value < threshold ? "ceil" : "round";
  return Math[fn]((value + Number.EPSILON) * precision) / precision;
}
