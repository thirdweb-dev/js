/**
 * Shorten the string for large value
 * Mainly used for
 * Examples:
 * 10_000 -> 10k
 * 1_000_000 -> 1M
 * 1_000_000_000 -> 1B
 * @example
 * ```ts
 * import { shortenLargeNumber } from "thirdweb/utils";
 * const numStr = shortenLargeNumber(1_000_000_000, )
 * ```
 * @utils
 */
export function shortenLargeNumber(value: number) {
  if (value === 0) {
    return "0.00";
  }
  if (value < 1000) {
    return value.toString();
  }
  if (value < 10_000) {
    return value.toLocaleString("en-US");
  }
  if (value < 1_000_000) {
    return formatLargeNumber(value, 1_000, "k");
  }
  if (value < 1_000_000_000) {
    return formatLargeNumber(value, 1_000_000, "M");
  }
  return formatLargeNumber(value, 1_000_000_000, "B");
}

/**
 * Shorten the string for large value (over 4 digits)
 * 1000 -> 1000
 * 10_000 -> 10k
 * 1_000_000 -> 1M
 * 1_000_000_000 -> 1B
 */
function formatLargeNumber(
  value: number,
  divisor: number,
  suffix: "k" | "M" | "B",
) {
  const quotient = value / divisor;
  if (Number.isInteger(quotient)) {
    return Math.floor(quotient) + suffix;
  }
  return quotient.toFixed(1).replace(/\.0$/, "") + suffix;
}
