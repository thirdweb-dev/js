import * as ox__Bytes from "ox/Bytes";
import { isHex } from "./helpers/is-hex.js";
import type { Hex, NumberToHexOpts } from "./hex.js";

export type ToBytesParameters = {
  /** Size of the output bytes. */
  size?: number;
};

/**
 * Converts a value to an array of bytes.
 * @param value - The value to convert.
 * @param opts - Optional parameters for the conversion.
 * @returns The array of bytes representing the value.
 * @example
 * ```ts
 * import { toBytes } from "thirdweb/utils";
 * const bytes = toBytes("0x1a4");
 * console.log(bytes); // Uint8Array(2) [ 1, 164 ]
 * ```
 * @utils
 */
export function toBytes(
  value: string | bigint | number | boolean | Hex,
  opts: ToBytesParameters = {},
): Uint8Array {
  switch (typeof value) {
    case "number":
    case "bigint":
      return numberToBytes(value, opts);
    case "boolean":
      return boolToBytes(value, opts);
    default:
      if (isHex(value)) {
        return hexToBytes(value, opts);
      }
      return stringToBytes(value, opts);
  }
}

export type BoolToBytesOpts = ox__Bytes.fromBoolean.Options;

/**
 * Converts a boolean value to a Uint8Array of bytes.
 * @param value - The boolean value to convert.
 * @param opts - Optional parameters for the conversion.
 * @returns The Uint8Array of bytes representing the boolean value.
 * @example
 * ```ts
 * import { boolToBytes } from "thirdweb/utils";
 * const bytes = boolToBytes(true);
 * console.log(bytes); // Uint8Array(1) [ 1 ]
 * ```
 * @utils
 */
export function boolToBytes(value: boolean, opts: BoolToBytesOpts = {}) {
  return ox__Bytes.fromBoolean(value, opts);
}

export type HexToBytesOpts = ox__Bytes.fromHex.Options;

/**
 * Converts a hexadecimal string to a Uint8Array of bytes.
 * @param hex_ The hexadecimal string to convert.
 * @param opts Options for converting the hexadecimal string.
 * @returns The Uint8Array of bytes.
 * @throws Error if the byte sequence is invalid.
 * @example
 * ```ts
 * import { hexToBytes } from "thirdweb/utils";
 * const bytes = hexToBytes("0x1a4");
 * console.log(bytes); // Uint8Array(2) [ 1, 164 ]
 * ```
 * @utils
 */
export function hexToBytes(hex_: Hex, opts: HexToBytesOpts = {}): Uint8Array {
  return ox__Bytes.fromHex(hex_, opts);
}

/**
 * Converts a number to bytes.
 * @param value - The number to convert.
 * @param opts - Options for converting the number to hex.
 * @returns The bytes representation of the number.
 * @example
 * ```ts
 * import { numberToBytes } from "thirdweb/utils";
 * const bytes = numberToBytes(420);
 * console.log(bytes); // Uint8Array(2) [ 1, 164 ]
 * ```
 * @utils
 */
export function numberToBytes(value: bigint | number, opts?: NumberToHexOpts) {
  return ox__Bytes.fromNumber(value, opts);
}

export type StringToBytesOpts = {
  /** Size of the output bytes. */
  size?: number;
};

/**
 * Converts a string to an array of bytes.
 * @param value - The string to convert.
 * @param opts - Optional parameters for the conversion.
 * @returns The array of bytes representing the string.
 * @example
 * ```ts
 * import { stringToBytes } from "thirdweb/utils";
 * const bytes = stringToBytes("Hello, world!");
 * console.log(bytes); // Uint8Array(13) [ 72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33 ]
 * ```
 * @utils
 */
export function stringToBytes(
  value: string,
  opts: StringToBytesOpts = {},
): Uint8Array {
  return ox__Bytes.fromString(value, opts);
}
