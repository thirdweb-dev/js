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

/**
 * Convert a number to a plain string, removing exponential notation
 * @internal
 */
export function numberToPlainString(num: number) {
  const str = num.toString();

  // If no exponential notation, return as-is
  if (str.indexOf("e") === -1) {
    return str;
  }

  // Parse exponential notation
  const [rawCoeff, rawExp = "0"] = str.split("e");
  const exponent = parseInt(rawExp, 10);
  // Separate sign and absolute coefficient
  const sign = rawCoeff?.startsWith("-") ? "-" : "";
  const coefficient = rawCoeff?.replace(/^[-+]/, "") || "";
  // Handle negative exponents (small numbers)
  if (exponent < 0) {
    const zeros = "0".repeat(Math.abs(exponent) - 1);
    const digits = coefficient.replace(".", "");
    return `${sign}0.${zeros}${digits}`;
  }

  // Handle positive exponents (large numbers)
  const [integer, decimal = ""] = coefficient?.split(".") || [];
  const zerosNeeded = exponent - decimal.length;

  if (zerosNeeded >= 0) {
    return `${integer}${decimal}${"0".repeat(zerosNeeded)}`;
  } else {
    // When exponent < decimal.length, we need to insert decimal point
    // at the correct position: integer.length + exponent
    const insertAt = (integer?.length ?? 0) + exponent;
    const result = integer + decimal;
    return `${result.slice(0, insertAt)}.${result.slice(insertAt)}`;
  }
}
