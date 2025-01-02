import { uint8ArrayToHex } from "./encoding/hex.js";

/**
 * @internal
 */
export function randomBytesHex(length = 32) {
  return uint8ArrayToHex(randomBytesBuffer(length));
}

/**
 * @internal
 */
export function randomBytesBuffer(length = 32) {
  return globalThis.crypto.getRandomValues(new Uint8Array(length));
}
