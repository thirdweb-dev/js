import { uint8ArrayToHex } from "./encoding/hex.js";

/**
 * @internal
 */
export async function randomBytes(length = 32) {
  return uint8ArrayToHex(
    globalThis.crypto.getRandomValues(new Uint8Array(length)),
  );
}
