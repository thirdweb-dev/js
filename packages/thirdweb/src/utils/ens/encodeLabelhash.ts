import type { Hex } from "../encoding/hex.js";

/**
 * @internal
 */
export function encodeLabelhash(hash: Hex): `[${string}]` {
  return `[${hash.slice(2)}]`;
}
