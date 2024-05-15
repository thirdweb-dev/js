import { uint8ArrayToHex } from "./encoding/hex.js";

/**
 * @internal
 */
export async function randomBytes32() {
  return uint8ArrayToHex(globalThis.crypto.getRandomValues(new Uint8Array(32)));
}
