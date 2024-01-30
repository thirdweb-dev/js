import { sha256 } from "@noble/hashes/sha256";
import { uint8ArrayToString } from "./uint8-array.js";

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
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return functionIdCache.get(fn)!;
  }
  const id = uint8ArrayToString(sha256(fn.toString()));
  functionIdCache.set(fn, id);
  return id;
}
