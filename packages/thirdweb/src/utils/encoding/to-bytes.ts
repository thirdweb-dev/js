import { cachedTextEncoder } from "../text-encoder.js";
import { assertSize } from "./helpers/assert-size.js";
import { charCodeToBase16 } from "./helpers/charcode-to-base-16.js";
import { type Hex, isHex } from "./helpers/is-hex.js";
import { type NumberToHexOpts, numberToHex, padHex } from "./hex.js";

type PadOptions = {
  dir?: "left" | "right";
  size?: number | null;
};

function padBytes(bytes: Uint8Array, { dir, size = 32 }: PadOptions = {}) {
  if (size === null) {
    return bytes;
  }
  if (bytes.length > size) {
    throw new Error(`Size overflow: ${bytes.length} > ${size}`);
  }
  const paddedBytes = new Uint8Array(size);
  for (let i = 0; i < size; i++) {
    const padEnd = dir === "right";
    paddedBytes[padEnd ? i : size - i - 1] =
      // biome-ignore lint/style/noNonNullAssertion: we know its there
      bytes[padEnd ? i : bytes.length - i - 1]!;
  }
  return paddedBytes;
}

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

export type BoolToBytesOpts = {
  /** Size of the output bytes. */
  size?: number;
};

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
  const bytes = new Uint8Array(1);
  bytes[0] = Number(value);
  if (typeof opts.size === "number") {
    assertSize(bytes, { size: opts.size });
    return padBytes(bytes, { size: opts.size });
  }
  return bytes;
}

export type HexToBytesOpts = {
  /** Size of the output bytes. */
  size?: number;
};

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
  let hex = hex_;
  if (opts.size) {
    assertSize(hex, { size: opts.size });
    hex = padHex(hex, { dir: "right", size: opts.size });
  }

  let hexString = hex.slice(2) as string;
  if (hexString.length % 2) {
    hexString = `0${hexString}`;
  }

  const length = hexString.length / 2;
  const bytes = new Uint8Array(length);
  for (let index = 0, j = 0; index < length; index++) {
    const nibbleLeft = charCodeToBase16(hexString.charCodeAt(j++));
    const nibbleRight = charCodeToBase16(hexString.charCodeAt(j++));
    if (nibbleLeft === undefined || nibbleRight === undefined) {
      throw new Error(
        `Invalid byte sequence ("${hexString[j - 2]}${
          hexString[j - 1]
        }" in "${hexString}").`,
      );
    }
    bytes[index] = nibbleLeft * 16 + nibbleRight;
  }
  return bytes;
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
  const hex = numberToHex(value, opts);
  return hexToBytes(hex);
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
  const bytes = cachedTextEncoder().encode(value);
  if (typeof opts.size === "number") {
    assertSize(bytes, { size: opts.size });
    return padBytes(bytes, { dir: "right", size: opts.size });
  }
  return bytes;
}
