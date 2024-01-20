import { base64ToString } from "../uint8-array.js";

export type Base64Prefix = "data:application/json;base64";
export type Base64String = `${Base64Prefix},${string}`;

/**
 * Checks if a given string is a base64 encoded string.
 * @param input - The string to be checked.
 * @returns True if the input string starts with "data:application/json;base64", false otherwise.
 */
export function isBase64String(input: string): input is Base64String {
  if (input.startsWith("data:application/json;base64")) {
    return true;
  }
  return false;
}

/**
 * Parses a base64 string and returns the decoded string.
 * @param input - The base64 string to parse.
 * @returns The decoded string.
 */
export function parseBase64String(input: Base64String) {
  const [, base64] = input.split(",") as [Base64Prefix, string];
  return base64ToString(base64);
}
