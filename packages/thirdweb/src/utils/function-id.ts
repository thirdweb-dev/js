import { sha256 } from "@noble/hashes/sha256";
import { uint8ArrayToHex } from "./encoding/hex.js";

// biome-ignore lint/suspicious/noExplicitAny: the whoel point here is to accept anything
type AnyFunction = (...args: any[]) => any;

// WeakMap should be fine, if we de-reference the function, it should be garbage collected
const functionIdCache = new WeakMap<AnyFunction, string>();

/**
 * Retrieves the unique identifier for a given function.
 * If the function has been previously cached, the cached identifier is returned.
 * Otherwise, a new identifier is generated using the function's string representation.
 * @param fn - The function for which to retrieve the identifier.
 * @returns The unique identifier for the function.
 * @internal
 */
export function getFunctionId(fn: AnyFunction) {
  if (functionIdCache.has(fn)) {
    // biome-ignore lint/style/noNonNullAssertion: the `has` above ensures that this will always be set
    return functionIdCache.get(fn)!;
  }
  const id = uint8ArrayToHex(sha256(fn.toString()));
  functionIdCache.set(fn, id);
  return id;
}
