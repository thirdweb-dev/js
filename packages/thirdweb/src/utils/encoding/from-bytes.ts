import * as ox__Bytes from "ox/Bytes";
import { type Hex, uint8ArrayToHex } from "./hex.js";

export type FromBytesParameters<
  TTo extends "string" | "hex" | "bigint" | "number" | "boolean",
> =
  | TTo
  | {
      /** Size of the bytes. */
      size?: number;
      /** Type to convert to. */
      to: TTo;
    };

export type FromBytesReturnType<TTo> = TTo extends "string"
  ? string
  : TTo extends "hex"
    ? Hex
    : TTo extends "bigint"
      ? bigint
      : TTo extends "number"
        ? number
        : TTo extends "boolean"
          ? boolean
          : never;

/**
 * Converts a Uint8Array to the specified type.
 * @param bytes - The Uint8Array to convert.
 * @param toOrOpts - The target type or conversion options.
 * @returns The converted value of the specified type.
 * @example
 * ```ts
 * import { fromBytes } from "thirdweb/utils";
 * const bytes = new Uint8Array([1, 164]);
 * const number = fromBytes(bytes, "number");
 * console.log(number); // 420
 * ```
 * @utils
 */
export function fromBytes<
  TTo extends "string" | "hex" | "bigint" | "number" | "boolean",
>(
  bytes: Uint8Array,
  toOrOpts: FromBytesParameters<TTo>,
): FromBytesReturnType<TTo> {
  const opts = typeof toOrOpts === "string" ? { to: toOrOpts } : toOrOpts;
  switch (opts.to) {
    case "number":
      return bytesToNumber(bytes, opts) as FromBytesReturnType<TTo>;
    case "bigint":
      return bytesToBigInt(bytes, opts) as FromBytesReturnType<TTo>;
    case "boolean":
      return bytesToBool(bytes, opts) as FromBytesReturnType<TTo>;
    case "string":
      return bytesToString(bytes, opts) as FromBytesReturnType<TTo>;
    default:
      return uint8ArrayToHex(bytes, opts) as FromBytesReturnType<TTo>;
  }
}

export type BytesToBigIntOpts = {
  /** Whether or not the number of a signed representation. */
  signed?: boolean;
  /** Size of the bytes. */
  size?: number;
};

/**
 * Converts a Uint8Array of bytes to a bigint.
 * @param bytes - The Uint8Array of bytes to convert.
 * @param opts - Optional parameters for the conversion.
 * @returns The converted bigint.
 * @example
 * ```ts
 * import { bytesToBigInt } from "thirdweb/utils";
 * const bytes = new Uint8Array([1, 164]);
 * const bigInt = bytesToBigInt(bytes);
 * console.log(bigInt); // 420n
 * ```
 * @utils
 */
export function bytesToBigInt(
  bytes: Uint8Array,
  opts: BytesToBigIntOpts = {},
): bigint {
  return ox__Bytes.toBigInt(bytes, opts);
}

export type BytesToBoolOpts = ox__Bytes.toBoolean.Options;

/**
 * Converts a byte array to a boolean value.
 * @param bytes_ - The byte array to convert.
 * @param opts - Optional parameters for the conversion.
 * @returns The boolean value converted from the byte array.
 * @throws Error if the byte array is invalid or the boolean representation is invalid.
 * @example
 * ```ts
 * import { bytesToBool } from "thirdweb/utils";
 * const bytes = new Uint8Array([1]);
 * const bool = bytesToBool(bytes);
 * console.log(bool); // true
 * ```
 * @utils
 */
export function bytesToBool(
  bytes_: Uint8Array,
  opts: BytesToBoolOpts = {},
): boolean {
  return ox__Bytes.toBoolean(bytes_, opts);
}

export type BytesToNumberOpts = BytesToBigIntOpts;

/**
 * Converts a Uint8Array of bytes to a number.
 * @param bytes - The Uint8Array of bytes to convert.
 * @param opts - Optional configuration options.
 * @returns The converted number.
 * @example
 * ```ts
 * import { bytesToNumber } from "thirdweb/utils";
 * const bytes = new Uint8Array([1, 164]);
 * const number = bytesToNumber(bytes);
 * console.log(number); // 420
 * ```
 * @utils
 */
export function bytesToNumber(
  bytes: Uint8Array,
  opts: BytesToNumberOpts = {},
): number {
  return ox__Bytes.toNumber(bytes, opts);
}

export type BytesToStringOpts = ox__Bytes.toString.Options;

/**
 * Converts an array of bytes to a string using UTF-8 encoding.
 * @param bytes_ - The array of bytes to convert.
 * @param opts - Optional parameters for the conversion.
 * @returns The resulting string.
 * @example
 * ```ts
 * import { bytesToString } from "thirdweb/utils";
 * const bytes = new Uint8Array([72, 101, 108, 108, 111]);
 * const string = bytesToString(bytes);
 * console.log(string); // "Hello"
 * ```
 * @utils
 */
export function bytesToString(
  bytes_: Uint8Array,
  opts: BytesToStringOpts = {},
): string {
  return ox__Bytes.toString(bytes_, opts);
}
