import * as ox__Hex from "ox/Hex";

export { type IsHexOptions, isHex } from "./helpers/is-hex.js";

export type Hex = ox__Hex.Hex;

type PadOptions = {
  dir?: "left" | "right";
  size?: number | null;
};

/**
 * Pads a hexadecimal string with zeros to a specified size.
 * @param hex_ The hexadecimal string to pad.
 * @param options The padding options.
 * @returns The padded hexadecimal string.
 * @throws Error if the resulting padded string exceeds the specified size.
 * @example
 * ```ts
 * import { padHex } from "thirdweb/utils";
 * const paddedHex = padHex("0x1a4", { size: 32 });
 * console.log(paddedHex); // "0x000000000000000000000000000001a4"
 * ```
 * @utils
 */
export function padHex(hex_: Hex, options: PadOptions = {}) {
  const { dir, size = 32 } = options;
  if (size === null) {
    return hex_;
  }
  if (dir === "right") {
    return ox__Hex.padRight(hex_, size);
  }
  return ox__Hex.padLeft(hex_, size);
}

//--------------------------------------------------------------------------
// FROM HEX
//--------------------------------------------------------------------------

export type HexToStringOpts = ox__Hex.toString.Options;

/**
 * Converts a hexadecimal string to a UTF-8 string.
 * @param hex The hexadecimal string to convert.
 * @param opts The options for the conversion.
 * @returns The UTF-8 string representation of the hexadecimal string.
 * @example
 * ```ts
 * import { hexToString } from "thirdweb/utils";
 * const string = hexToString("0x48656c6c6f2c20776f726c6421");
 * console.log(string); // "Hello, world!"
 * ```
 * @utils
 */
export function hexToString(hex: Hex, opts: HexToStringOpts = {}): string {
  return ox__Hex.toString(hex, opts);
}

export type HexToBigIntOpts = ox__Hex.toBigInt.Options;

/**
 * Converts a hexadecimal string to a BigInt.
 * @param hex - The hexadecimal string to convert.
 * @param opts - Optional parameters for the conversion.
 * @returns The BigInt representation of the hexadecimal string.
 * @example
 * ```ts
 * import { hexToBigInt } from "thirdweb/utils";
 * const bigInt = hexToBigInt("0x1a4");
 * console.log(bigInt); // 420n
 * ```
 * @utils
 */
export function hexToBigInt(hex: Hex, opts: HexToBigIntOpts = {}): bigint {
  return ox__Hex.toBigInt(hex, opts);
}

export type HexToNumberOpts = HexToBigIntOpts;
/**
 * Converts a hexadecimal string to a number.
 * @param hex The hexadecimal string to convert.
 * @param opts Optional options for the conversion.
 * @returns The converted number.
 * @example
 * ```ts
 * import { hexToNumber } from "thirdweb/utils";
 * const number = hexToNumber("0x1a4");
 * console.log(number); // 420
 * ```
 * @utils
 */
export function hexToNumber(hex: Hex, opts: HexToNumberOpts = {}): number {
  return ox__Hex.toNumber(hex, opts);
}

export type HexToBoolOpts = ox__Hex.toBoolean.Options;

/**
 * Converts a hexadecimal string to a boolean value.
 * @param hex The hexadecimal string to convert.
 * @param opts Optional options for the conversion.
 * @returns The boolean value corresponding to the hexadecimal string.
 * @throws Error if the hexadecimal string is invalid.
 * @example
 * ```ts
 * import { hexToBool } from "thirdweb/utils";
 * const bool = hexToBool("0x01");
 * console.log(bool); // true
 * ```
 * @utils
 */
export function hexToBool(hex: Hex, opts: HexToBoolOpts = {}): boolean {
  return ox__Hex.toBoolean(hex, opts);
}

export type HexToUint8ArrayOpts = ox__Hex.toBytes.Options;

/**
 * Converts a hexadecimal string to a Uint8Array.
 * @param hex The hexadecimal string to convert.
 * @param opts Options for the conversion.
 * @returns The Uint8Array representation of the hexadecimal string.
 * @example
 * ```ts
 * import { hexToUint8Array } from "thirdweb/utils";
 * const bytes = hexToUint8Array("0x48656c6c6f2c20776f726c6421");
 * console.log(bytes); // Uint8Array([72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33])
 * ```
 * @utils
 */
export function hexToUint8Array(
  hex: Hex,
  opts: HexToUint8ArrayOpts = {},
): Uint8Array {
  return ox__Hex.toBytes(hex, opts);
}

export type FromHexParameters<
  TTo extends "string" | "bigint" | "number" | "bytes" | "boolean",
> =
  | TTo
  | {
      /** Size (in bytes) of the hex value. */
      size?: number;
      /** Type to convert to. */
      to: TTo;
    };

export type FromHexReturnType<TTo> = TTo extends "string"
  ? string
  : TTo extends "bigint"
    ? bigint
    : TTo extends "number"
      ? number
      : TTo extends "bytes"
        ? Uint8Array
        : TTo extends "boolean"
          ? boolean
          : never;

/**
 * Converts a hexadecimal string to the specified type.
 * @param hex - The hexadecimal string to convert.
 * @param toOrOpts - The target type or conversion options.
 * @returns The converted value of the specified type.
 * @example
 * ```ts
 * import { fromHex } from "thirdweb/utils";
 * const string = fromHex("0x48656c6c6f2c20776f726c6421", "string");
 * console.log(string); // "Hello, world!"
 * ```
 * @utils
 */
export function fromHex<
  TTo extends "string" | "bigint" | "number" | "bytes" | "boolean",
>(hex: Hex, toOrOpts: FromHexParameters<TTo>): FromHexReturnType<TTo> {
  const opts = typeof toOrOpts === "string" ? { to: toOrOpts } : toOrOpts;

  switch (opts.to) {
    case "number":
      return hexToNumber(hex, opts) as FromHexReturnType<TTo>;
    case "bigint":
      return hexToBigInt(hex, opts) as FromHexReturnType<TTo>;
    case "string":
      return hexToString(hex, opts) as FromHexReturnType<TTo>;
    case "boolean":
      return hexToBool(hex, opts) as FromHexReturnType<TTo>;
    default:
      return hexToUint8Array(hex, opts) as FromHexReturnType<TTo>;
  }
}

//--------------------------------------------------------------------------
// TO HEX
//--------------------------------------------------------------------------

export type BoolToHexOpts = ox__Hex.fromBoolean.Options;

/**
 * Converts a boolean value to a hexadecimal string representation.
 * @param value - The boolean value to convert.
 * @param opts - Optional options for the conversion.
 * @returns The hexadecimal string representation of the boolean value.
 * @example
 * ```ts
 * import { boolToHex } from "thirdweb/utils";
 * const hex = boolToHex(true);
 * console.log(hex); // "0x01"
 * ```
 * @utils
 */
export function boolToHex(value: boolean, opts: BoolToHexOpts = {}): Hex {
  return ox__Hex.fromBoolean(value, opts);
}

export type Uint8ArrayToHexOpts = ox__Hex.fromBoolean.Options;

/**
 * Converts an array of bytes to a hexadecimal string.
 * @param value - The array of bytes to convert.
 * @param opts - Optional parameters for the conversion.
 * @returns The hexadecimal string representation of the bytes.
 * @example
 * ```ts
 * import { uint8arrayToHex } from "thirdweb/utils";
 * const hex = uint8arrayToHex(new Uint8Array([72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100]));
 * console.log(hex); // "0x48656c6c6f2c20776f726c64"
 * ```
 * @utils
 */
export function uint8ArrayToHex(
  value: Uint8Array,
  opts: Uint8ArrayToHexOpts = {},
): Hex {
  return ox__Hex.fromBytes(value, opts);
}

export type NumberToHexOpts = ox__Hex.fromNumber.Options;

/**
 * Converts a number or bigint to a hexadecimal string.
 * @param value_ - The number or bigint value to convert.
 * @param opts - Optional configuration options.
 * @returns The hexadecimal representation of the input value.
 * @throws An error if the input value is not within the safe integer range.
 * @example
 * ```ts
 * import { numberToHex } from "thirdweb/utils";
 * const hex = numberToHex(420);
 * console.log(hex); // "0x1a4"
 * ```
 * @utils
 */
export function numberToHex(
  value_: number | bigint,
  opts: NumberToHexOpts = {},
): Hex {
  return ox__Hex.fromNumber(value_, opts);
}

export type StringToHexOpts = ox__Hex.fromString.Options;

/**
 * Converts a string to its hexadecimal representation.
 * @param value_ The string to convert to hexadecimal.
 * @param opts Options for the conversion.
 * @returns The hexadecimal representation of the input string.
 * @example
 * ```ts
 * import { stringToHex } from "thirdweb/utils";
 * const hex = stringToHex("Hello, world!");
 * console.log(hex); // "0x48656c6c6f2c20776f726c6421"
 * ```
 * @utils
 */
export function stringToHex(value_: string, opts: StringToHexOpts = {}): Hex {
  return ox__Hex.fromString(value_, opts);
}

export type ToHexParameters = {
  /** The size (in bytes) of the output hex value. */
  size?: number;
};

/**
 * Converts a value to its hexadecimal representation.
 * @param value - The value to convert to hexadecimal.
 * @param opts - Optional parameters for the conversion.
 * @returns The hexadecimal representation of the value.
 * @example
 * ```ts
 * import { toHex } from "thirdweb/utils";
 * const hex = toHex(420);
 * console.log(hex); // "0x1a4"
 * ```
 * @utils
 */
export function toHex(
  value: string | number | bigint | boolean | Uint8Array,
  opts: ToHexParameters = {},
): Hex {
  switch (typeof value) {
    case "number":
    case "bigint":
      return numberToHex(value, opts);
    case "string":
      return stringToHex(value, opts);
    case "boolean":
      return boolToHex(value, opts);
    default:
      return uint8ArrayToHex(value, opts);
  }
}
