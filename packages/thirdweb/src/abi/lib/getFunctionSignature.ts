import { type AbiFunction, formatAbiItem } from "abitype";
import { normalizeSignature } from "./normalizeSignature.js";

/**
 * Returns the function signature for a given function name or AbiFunction object.
 * @param fn - The function name or AbiFunction object.
 * @returns The normalized function signature.
 * @internal
 */
export function getFunctionSignature(fn: string | AbiFunction) {
  return normalizeSignature(typeof fn === "string" ? fn : formatAbiItem(fn));
}
