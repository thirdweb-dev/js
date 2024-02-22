// slightly tweaked re-exports from viem for the moment
import { assertSize } from "./helpers/assert-size.js";
import { cachedTextDecoder } from "../text-decoder.js";
import { cachedTextEncoder } from "../text-encoder.js";
import type { Hex } from "./helpers/is-hex.js";
import { charCodeToBase16 } from "./helpers/charcode-to-base-16.js";

export { type Hex, isHex, type IsHexOptions } from "./helpers/is-hex.js";

type TrimOptions = {
  dir?: "left" | "right";
};
type TrimReturnType<TValue extends Uint8Array | Hex> = TValue extends Hex
  ? Hex
  : Uint8Array;

function trim<TValue extends Uint8Array | Hex>(
  hexOrBytes: TValue,
  options: TrimOptions = {},
): TrimReturnType<TValue> {
  const dir = options.dir || "left";
  let data: any =
    typeof hexOrBytes === "string" ? hexOrBytes.replace("0x", "") : hexOrBytes;

  let sliceLength = 0;
  for (let i = 0; i < data.length - 1; i++) {
    if (data[dir === "left" ? i : data.length - i - 1].toString() === "0") {
      sliceLength++;
    } else {
      break;
    }
  }
  data =
    dir === "left"
      ? data.slice(sliceLength)
      : data.slice(0, data.length - sliceLength);

  if (typeof hexOrBytes === "string") {
    if (data.length === 1 && dir === "right") {
      data = `${data}0`;
    }
    return `0x${
      data.length % 2 === 1 ? `0${data}` : data
    }` as TrimReturnType<TValue>;
  }
  return data as TrimReturnType<TValue>;
}

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
 */
export function padHex(hex_: Hex, options: PadOptions = {}) {
  const { dir, size = 32 } = options;
  if (size === null) {
    return hex_;
  }
  const hex = hex_.replace("0x", "");
  if (hex.length > size * 2) {
    throw new Error(`Size overflow: ${Math.ceil(hex.length / 2)} > ${size}`);
  }

  return `0x${hex[dir === "right" ? "padEnd" : "padStart"](
    size * 2,
    "0",
  )}` as Hex;
}

//--------------------------------------------------------------------------
// FROM HEX
//--------------------------------------------------------------------------

export type HexToStringOpts = {
  /** Size (in bytes) of the hex value. */
  size?: number;
};

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
 */
export function hexToString(hex: Hex, opts: HexToStringOpts = {}): string {
  let bytes = hexToUint8Array(hex);
  if (opts.size) {
    assertSize(bytes, { size: opts.size });
    bytes = trim(bytes, { dir: "right" });
  }
  return cachedTextDecoder().decode(bytes);
}

export type HexToBigIntOpts = {
  /** Whether or not the number of a signed representation. */
  signed?: boolean;
  /** Size (in bytes) of the hex value. */
  size?: number;
};

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
 */
export function hexToBigInt(hex: Hex, opts: HexToBigIntOpts = {}): bigint {
  const { signed } = opts;

  if (opts.size) {
    assertSize(hex, { size: opts.size });
  }

  const value = BigInt(hex);
  if (!signed) {
    return value;
  }

  const size = (hex.length - 2) / 2;
  const max = (1n << (BigInt(size) * 8n - 1n)) - 1n;
  if (value <= max) {
    return value;
  }

  return value - BigInt(`0x${"f".padStart(size * 2, "f")}`) - 1n;
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
 */
export function hexToNumber(hex: Hex, opts: HexToNumberOpts = {}): number {
  return Number(hexToBigInt(hex, opts));
}

export type HexToBoolOpts = {
  /** Size (in bytes) of the hex value. */
  size?: number;
};

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
 */
export function hexToBool(hex: Hex, opts: HexToBoolOpts = {}): boolean {
  if (opts.size) {
    assertSize(hex, { size: opts.size });
    hex = trim(hex);
  }
  if (trim(hex) === "0x00") {
    return false;
  }
  if (trim(hex) === "0x01") {
    return true;
  }
  throw new Error(`Invalid hex boolean: ${hex}`);
}

export type HexToUint8ArrayOpts = {
  /** Size of the output bytes. */
  size?: number;
};

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
 */
export function hexToUint8Array(
  hex: Hex,
  opts: HexToUint8ArrayOpts = {},
): Uint8Array {
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
      throw new Error(`Invalid hex character: ${hexString}`);
    }
    bytes[index] = nibbleLeft * 16 + nibbleRight;
  }
  return bytes;
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

const hexes = /* @__PURE__ */ (() =>
  Array.from({ length: 256 }, (_v, i) => i.toString(16).padStart(2, "0")))();

export type BoolToHexOpts = {
  /** The size (in bytes) of the output hex value. */
  size?: number;
};

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
 */
export function boolToHex(value: boolean, opts: BoolToHexOpts = {}): Hex {
  const hex = `0x${Number(value)}` as const;
  if (typeof opts.size === "number") {
    assertSize(hex, { size: opts.size });
    return padHex(hex, { size: opts.size });
  }
  return hex;
}

export type Uint8ArrayToHexOpts = {
  /** The size (in bytes) of the output hex value. */
  size?: number;
};

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
 */
export function uint8ArrayToHex(
  value: Uint8Array,
  opts: Uint8ArrayToHexOpts = {},
): Hex {
  let string = "";
  for (let i = 0; i < value.length; i++) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    string += hexes[value[i]!];
  }
  const hex = `0x${string}` as const;

  if (typeof opts.size === "number") {
    assertSize(hex, { size: opts.size });
    return padHex(hex, { dir: "right", size: opts.size });
  }
  return hex;
}

export type NumberToHexOpts =
  | {
      /** Whether or not the number of a signed representation. */
      signed?: boolean;
      /** The size (in bytes) of the output hex value. */
      size: number;
    }
  | {
      signed?: never;
      /** The size (in bytes) of the output hex value. */
      size?: number;
    };

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
 */
export function numberToHex(
  value_: number | bigint,
  opts: NumberToHexOpts = {},
): Hex {
  const { signed, size } = opts;

  const value = BigInt(value_);

  let maxValue: bigint | number | undefined;
  if (size) {
    if (signed) {
      maxValue = (1n << (BigInt(size) * 8n - 1n)) - 1n;
    } else {
      maxValue = 2n ** (BigInt(size) * 8n) - 1n;
    }
  } else if (typeof value_ === "number") {
    maxValue = BigInt(Number.MAX_SAFE_INTEGER);
  }

  const minValue = typeof maxValue === "bigint" && signed ? -maxValue - 1n : 0;

  if ((maxValue && value > maxValue) || value < minValue) {
    const suffix = typeof value_ === "bigint" ? "n" : "";
    throw new Error(
      `Number "${value_}${suffix}" is not in safe ${
        size ? `${size * 8}-bit ${signed ? "signed" : "unsigned"} ` : ""
      }integer range ${
        maxValue ? `(${minValue} to ${maxValue})` : `(above ${minValue})`
      }`,
    );
  }

  const hex = `0x${(signed && value < 0
    ? (1n << BigInt(size * 8)) + BigInt(value)
    : value
  ).toString(16)}` as Hex;
  if (size) {
    return padHex(hex, { size }) as Hex;
  }
  return hex;
}

export type StringToHexOpts = {
  /** The size (in bytes) of the output hex value. */
  size?: number;
};

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
 */
export function stringToHex(value_: string, opts: StringToHexOpts = {}): Hex {
  const value = cachedTextEncoder().encode(value_);
  return uint8ArrayToHex(value, opts);
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
