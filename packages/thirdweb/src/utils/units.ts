/**
 * Converts a given number of units to a string representation with a specified number of decimal places.
 * @param units - The number of units to convert.
 * @param decimals - The number of decimal places to include in the string representation.
 * @returns The string representation of the converted units.
 * @example
 * ```ts
 * import { toTokens } from "thirdweb/utils";
 * toTokens(1000000000000000000n, 18)
 * // '1'
 * ```
 * @utils
 */
export function toTokens(units: bigint, decimals: number): string {
  // Convert to string once and handle negativity.
  const stringValue = units.toString();
  const prefix = stringValue[0] === "-" ? "-" : "";
  // Abusing that string "-" is truthy
  const absStringValue = prefix ? stringValue.slice(1) : stringValue;

  // Ensure we have enough digits for the fractional part.
  const paddedValue = absStringValue.padStart(decimals + 1, "0");
  const splitIndex = paddedValue.length - decimals;

  // Extract integer and fraction parts directly.
  const integerPart = paddedValue.slice(0, splitIndex) || "0";
  let fractionPart = paddedValue.slice(splitIndex);

  // Manually trim trailing zeros from the fraction part.
  for (let i = fractionPart.length - 1; i >= 0; i--) {
    if (fractionPart[i] !== "0") {
      fractionPart = fractionPart.slice(0, i + 1);
      break;
    }
    // check if the next digit is a zero also
    // If all zeros, make fraction part empty
    if (i === 0) {
      fractionPart = "";
    }
  }

  // Construct and return the formatted string.
  return `${prefix}${integerPart}${fractionPart ? `.${fractionPart}` : ""}`;
}

/**
 * Converts a value from wei to ether.
 * @param wei The value in wei to be converted.
 * @returns The converted value in ether.
 * @example
 * ```ts
 * import { toEther } from "thirdweb/utils";
 * toEther(1000000000000000000n)
 * // '1'
 * ```
 * @utils
 */
export function toEther(wei: bigint) {
  return toTokens(wei, 18);
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

/**
 * Converts the specified number of tokens to Wei.
 * @param tokens The number of tokens to convert.
 * @returns The converted value in Wei.
 * @example
 * ```ts
 * import { toWei } from "thirdweb/utils";
 * toWei('1')
 * // 1000000000000000000n
 * ```
 * @utils
 */
export function toWei(tokens: string) {
  return toUnits(tokens, 18);
}

/**
 * Converts the specified number from gwei to wei.
 * @param gwei The number of gwei to convert.
 * @returns The converted value in wei.
 * @example
 * ```ts
 * import { fromGwei } from "thirdweb/utils";
 * fromGwei('1')
 * // 1000000000n
 * ```
 * @utils
 */
export function fromGwei(gwei: string) {
  return toUnits(gwei, 9);
}
