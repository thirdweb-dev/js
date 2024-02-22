export type Hex = `0x${string}`;

export type IsHexOptions = {
  /** If set to true, the value must start with "0x" and only contain hexadecimal characters. If set to false, the value can start with "0x" or not. Default is true. */
  strict?: boolean;
};

/**
 * Checks if a value is a valid hexadecimal string.
 * @param value - The value to be checked.
 * @param options - Optional configuration for the validation.
 * @returns True if the value is a valid hexadecimal string, false otherwise.
 * @example
 * ```ts
 * import { isHex } from "thirdweb/utils";
 * const result = isHex("0x1a4");
 * console.log(result); // true
 * ```
 */
export function isHex(
  value: unknown,
  options: IsHexOptions = {},
): value is Hex {
  if (!value) {
    return false;
  }
  if (typeof value !== "string") {
    return false;
  }
  return options.strict
    ? /^0x[0-9a-fA-F]*$/.test(value)
    : value.startsWith("0x");
}
