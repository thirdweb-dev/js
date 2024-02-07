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
  const prefix = integerPart[0] === "-" ? "-" : "";
  // Once again, abusing that string "-" is truthy
  if (prefix) {
    integerPart = integerPart.slice(1);
  }

  // Ensure the fraction part is not longer than necessary.
  fractionPart = fractionPart.substring(0, decimals).padEnd(decimals, "0");

  // Handle rounding when fractionPart is longer than decimals.
  if (decimals > 0 && fractionPart.length > decimals) {
    const roundingPart = fractionPart[decimals];
    if (roundingPart && parseInt(roundingPart, 10) >= 5) {
      // Add 1 to the last digit of the needed fraction part and handle carry.
      const roundedFraction = (
        BigInt(fractionPart.substring(0, decimals)) + 1n
      ).toString();
      if (roundedFraction.length > decimals) {
        // Handle carry to the integer part.
        integerPart = (BigInt(integerPart) + 1n).toString();
        fractionPart = roundedFraction.substring(1);
      } else {
        fractionPart = roundedFraction;
      }
    } else {
      // No rounding needed, just trim the fraction part.
      fractionPart = fractionPart.substring(0, decimals);
    }
  }

  // Convert to BigInt. Assuming here that the decimal part is effectively "moved" to the integer part by padding with zeros.
  return BigInt(`${prefix}${integerPart}${fractionPart.padEnd(decimals, "0")}`);
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
