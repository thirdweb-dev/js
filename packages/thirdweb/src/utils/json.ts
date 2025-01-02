/**
 * Stringify a JSON object and convert all bigint values to string
 *
 * If you are getting this error: "Exception: Do not know how to serialize a BigInt",
 * you probably can use this function to parse the data.
 * Because bigint is not an accepted value of the JSON format.
 *
 * @returns An object with all bigint values converted to string
 * @example
 * ```ts
 * import { stringify } from "thirdweb/utils";
 * const obj = { tokenId: 0n };
 * const str = stringify(obj); // "{"tokenId":"0"}"
 * ```
 * @utils
 */
export function stringify(
  // biome-ignore lint/suspicious/noExplicitAny: JSON.stringify signature
  value: any,
  // biome-ignore lint/suspicious/noExplicitAny: JSON.stringify signature
  replacer?: ((this: any, key: string, value: any) => any) | null,
  space?: string | number,
) {
  const res = JSON.stringify(
    value,
    (key, value_) => {
      const value__ = typeof value_ === "bigint" ? value_.toString() : value_;
      return typeof replacer === "function" ? replacer(key, value__) : value__;
    },
    space,
  );
  return res;
}
