import { base64ToString } from "../uint8-array.js";

type Base64Prefix = "data:application/json;base64";
type Base64String = `${Base64Prefix},${string}`;

/**
 * Checks if a given string is a base64 encoded JSON string.
 * @param input - The string to be checked.
 * @returns True if the input string starts with "data:application/json;base64", false otherwise.
 * @example
 * ```ts
 * isBase64JSON("data:application/json;base64,eyJ0ZXN0IjoiYmFzZTY0In0=")
 * // true
 * ```
 */
export function isBase64JSON(input: string): input is Base64String {
  if (input.startsWith("data:application/json;base64")) {
    return true;
  }
  return false;
}

/**
 * Parses a base64 string and returns the decoded string.
 * @param input - The base64 string to parse.
 * @returns The decoded string.
 * @example
 * ```ts
 * parseBase64String("data:application/json;base64,eyJ0ZXN0IjoiYmFzZTY0In0=")
 * // '{"test":"base64"}'
 * ```
 */
export function parseBase64String(input: Base64String) {
  const [, base64] = input.split(",") as [Base64Prefix, string];
  return base64ToString(base64);
}
