import type { Hex } from "./is-hex.js";

type TrimOptions = {
  dir?: "left" | "right";
};
export type TrimReturnType<TValue extends Uint8Array | Hex> = TValue extends Hex
  ? Hex
  : Uint8Array;

/**
 * Trims leading or trailing zeros from a hexadecimal string or byte array.
 *
 * @param hexOrBytes - The hexadecimal string or byte array to trim.
 * @param options - The options for trimming. Default is to trim leading zeros.
 * @returns The trimmed hexadecimal string or byte array.
 * @internal
 */
export function trim<TValue extends Uint8Array | Hex>(
  hexOrBytes: TValue,
  { dir = "left" }: TrimOptions = {},
): TrimReturnType<TValue> {
  // biome-ignore lint/suspicious/noExplicitAny: TODO: fix any
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
