export type Hex = `0x${string}`;

export type IsHexOptions = {
  /** If set to true, the value must start with "0x" and only contain hexadecimal characters. If set to false, the value can start with "0x" or not. Default is true. */
  strict?: boolean;
};

/**
 * Checks if a value is a valid hexadecimal string.
 * @param value - The value to be checked.
 * @param options - Optional configuration for the validation.
 * @param options.strict - If set to true, the value must start with "0x" and only contain hexadecimal characters. If set to false, the value must only start with "0x".
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
  { strict = true }: IsHexOptions = {},
): value is Hex {
  if (!value) {
    return false;
  }
  if (typeof value !== "string") {
    return false;
  }
  return strict ? /^0x[0-9a-fA-F]*$/.test(value) : value.startsWith("0x");
}
