const etherUnits = {
  gwei: 9,
  wei: 18,
};
const gweiUnits = {
  ether: -9,
  wei: 9,
};

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
export function formatUnits(value: bigint, decimals: number) {
  let display = value.toString();

  const negative = display.startsWith("-");
  if (negative) {
    display = display.slice(1);
  }

  display = display.padStart(decimals, "0");

  // eslint-disable-next-line prefer-const
  let [integer, fraction] = [
    display.slice(0, display.length - decimals),
    display.slice(display.length - decimals),
  ];
  fraction = fraction.replace(/(0+)$/, "");
  return `${negative ? "-" : ""}${integer || "0"}${
    fraction ? `.${fraction}` : ""
  }`;
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
export function parseUnits(value: string, decimals: number) {
  let [integer, fraction = "0"] = value.split(".") as [
    string,
    string | undefined,
  ];

  const negative = integer.startsWith("-");
  if (negative) {
    integer = integer.slice(1);
  }

  // trim leading zeros.
  fraction = fraction.replace(/(0+)$/, "");

  // round off if the fraction is larger than the number of decimals.
  if (decimals === 0) {
    if (Math.round(Number(`.${fraction}`)) === 1) {
      integer = `${BigInt(integer) + 1n}`;
    }
    fraction = "";
  } else if (fraction.length > decimals) {
    const [left, unit, right] = [
      fraction.slice(0, decimals - 1),
      fraction.slice(decimals - 1, decimals),
      fraction.slice(decimals),
    ];

    const rounded = Math.round(Number(`${unit}.${right}`));
    if (rounded > 9) {
      fraction = `${BigInt(left) + BigInt(1)}0`.padStart(left.length + 1, "0");
    } else {
      fraction = `${left}${rounded}`;
    }

    if (fraction.length > decimals) {
      fraction = fraction.slice(1);
      integer = `${BigInt(integer) + 1n}`;
    }

    fraction = fraction.slice(0, decimals);
  } else {
    fraction = fraction.padEnd(decimals, "0");
  }

  return BigInt(`${negative ? "-" : ""}${integer}${fraction}`);
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
