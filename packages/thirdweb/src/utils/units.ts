const etherUnits = {
  gwei: 9,
  wei: 18,
} as const;
const gweiUnits = {
  ether: -9,
  wei: 9,
} as const;

/**
 * Formats a bigint value into a string representation with the specified number of decimal places.
 * @param value - The bigint value to format.
 * @param decimals - The number of decimal places to include in the formatted string.
 * @returns The formatted string representation of the value.
 * @example
 * ```ts
 * formatUnits(420000000000n, 9)
 * // '420'
 * ```
 */
export function formatUnits(value: bigint, decimals: number): string {
  // Convert to string once and handle negativity.
  const stringValue = value.toString();
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
 * Formats the given wei value into ether units.
 * @param wei The wei value to format.
 * @param unit The unit to format the wei value into. Defaults to 'wei'.
 * @returns The formatted value in the specified unit.
 * @example
 * ```ts
 * formatEther(1000000000000000000n)
 * // '1'
 * ```
 */
export function formatEther(wei: bigint, unit: "wei" | "gwei" = "wei") {
  return formatUnits(wei, etherUnits[unit]);
}

/**
 * Formats the given wei value into the specified unit.
 * @param wei The wei value to format.
 * @param unit The unit to format the wei value into. Defaults to 'wei'.
 * @returns The formatted value.
 * @example
 * ```ts
 * formatGwei(1000000000n)
 * // '1'
 * ```
 */
export function formatGwei(wei: bigint, unit: "wei" = "wei") {
  return formatUnits(wei, gweiUnits[unit]);
}

/**
 * Parses a string value into a BigInt representation with a specified number of decimal places.
 * @param value - The string value to parse.
 * @param decimals - The number of decimal places to include in the result.
 * @returns The parsed value as a BigInt.
 * @example
 * ```ts
 * parseUnits('420', 9)
 * // 420000000000n
 * ```
 */
export function parseUnits(value: string, decimals: number): bigint {
  let [integerPart, fractionPart = ""] = value.split(".") as [string, string];
  const prefix = integerPart.startsWith("-") ? "-" : "";
  if (prefix) {
    integerPart = integerPart.slice(1);
  }

  fractionPart = fractionPart.padEnd(decimals, "0"); // Ensure fraction part is at least 'decimals' long.

  if (decimals === 0) {
    // Check if there's any fraction part that would necessitate rounding up the integer part.
    if (fractionPart[0] && parseInt(fractionPart[0]) >= 5) {
      integerPart = (BigInt(integerPart) + 1n).toString();
    }
    fractionPart = ""; // No fraction part is needed when decimals === 0.
  } else {
    // When decimals > 0, handle potential rounding based on the digit right after the specified decimal places.
    if (fractionPart.length > decimals) {
      const roundingDigit = fractionPart[decimals];
      if (roundingDigit && parseInt(roundingDigit, 10) >= 5) {
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
 * Parses a string representation of ether into its corresponding value in wei or gwei.
 * @param ether - The string representation of ether to parse.
 * @param unit - The unit to convert the ether value to. Defaults to 'wei'.
 * @returns The parsed value in the specified unit.
 * @example
 * ```ts
 * parseEther('420')
 * // 420000000000000000000n
 * ```
 */
export function parseEther(ether: string, unit: "wei" | "gwei" = "wei") {
  return parseUnits(ether, etherUnits[unit]);
}

/**
 * Parses the given ether value into the specified unit.
 * @param ether The ether value to parse.
 * @param unit The unit to parse the ether value into. Defaults to 'wei'.
 * @returns The parsed value in the specified unit.
 * @example
 * ```ts
 * parseGwei('420')
 * // 420000000000n
 * ```
 */
export function parseGwei(ether: string, unit: "wei" = "wei") {
  return parseUnits(ether, gweiUnits[unit]);
}
