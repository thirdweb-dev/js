/**
 * Stringify a JSON object and convert all bigint values to string
 *
 * If you are getting this error: "Exception: Do not know how to serialize a BigInt",
 * you probably can use this function to parse the data.
 * Because bigint is not an accepted value of the JSON format.
 *
 * @returns An object with all bigint values converted to string
 * @example
 * ```ts
 * import { stringify } from "thirdweb/utils";
 * const obj = { tokenId: 0n };
 * const str = stringify(obj); // "{"tokenId":"0"}"
 * ```
 * @utils
 */
export function stringify(
  // biome-ignore lint/suspicious/noExplicitAny: JSON.stringify signature
  value: any,
  // biome-ignore lint/suspicious/noExplicitAny: JSON.stringify signature
  replacer?: ((this: any, key: string, value: any) => any) | null,
  space?: string | number,
) {
  const res = JSON.stringify(
    value,
    (key, value_) => {
      const value__ = typeof value_ === "bigint" ? value_.toString() : value_;
      return typeof replacer === "function" ? replacer(key, value__) : value__;
    },
    space,
  );
  return res;
}

/**
 * Converts a string representation of a number with decimal places to a BigInt representation.
 * @param tokens - The string representation of the number, including the integer and fraction parts.
 * @param decimals - The number of decimal places to include in the BigInt representation.
 * @returns The BigInt representation of the number.
 * @example
 * ```ts
 * import { toUnits } from "thirdweb/utils";
 * toUnits('1', 18)
 * // 1000000000000000000n
 * ```
 * @utils
 */
export function toUnits(tokens: string, decimals: number): bigint {
  if (tokens.includes("e")) {
    tokens = Number(tokens).toFixed(decimals);
  }

  let [integerPart, fractionPart = ""] = tokens.split(".") as [string, string];
  const prefix = integerPart.startsWith("-") ? "-" : "";
  if (prefix) {
    integerPart = integerPart.slice(1);
  }

  fractionPart = fractionPart.padEnd(decimals, "0"); // Ensure fraction part is at least 'decimals' long.

  if (decimals === 0) {
    // Check if there's any fraction part that would necessitate rounding up the integer part.
    if (fractionPart[0] && Number.parseInt(fractionPart[0]) >= 5) {
      integerPart = (BigInt(integerPart) + 1n).toString();
    }
    fractionPart = ""; // No fraction part is needed when decimals === 0.
  } else {
    // When decimals > 0, handle potential rounding based on the digit right after the specified decimal places.
    if (fractionPart.length > decimals) {
      const roundingDigit = fractionPart[decimals];
      if (roundingDigit && Number.parseInt(roundingDigit, 10) >= 5) {
        // If rounding is needed, add 1 to the last included digit of the fraction part.
        const roundedFraction =
          BigInt(fractionPart.substring(0, decimals)) + 1n;
        fractionPart = roundedFraction.toString().padStart(decimals, "0");

        if (fractionPart.length > decimals) {
          // If rounding the fraction results in a length increase (e.g., .999 -> 1.000), increment the integer part.
          integerPart = (BigInt(integerPart) + 1n).toString();
          // Adjust the fraction part if it's longer than the specified decimals due to rounding up.
          fractionPart = fractionPart.substring(fractionPart.length - decimals);
        }
      } else {
        // If no rounding is necessary, just truncate the fraction part to the specified number of decimals.
        fractionPart = fractionPart.substring(0, decimals);
      }
    }
    // If the fraction part is shorter than the specified decimals, it's already handled by padEnd() above.
  }

  // Combine the integer and fraction parts into the final BigInt representation.
  return BigInt(`${prefix}${integerPart}${fractionPart}`);
}
