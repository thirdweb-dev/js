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
  return (typeof globalThis.crypto !== 'undefined'
    ? globalThis.crypto
    : (await import('crypto')).webcrypto).getRandomValues(new Uint8Array(length));
}
