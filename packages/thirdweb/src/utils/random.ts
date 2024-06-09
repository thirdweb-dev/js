import { uint8ArrayToHex } from "./encoding/hex.js";

/**
 * @internal
 */
export async function randomBytesHex(length = 32) {
  return uint8ArrayToHex(await randomBytesBuffer(length));
}

/**
 * @internal
 */
export async function randomBytesBuffer(length = 32) {
  return (typeof globalThis.crypto !== 'undefined'
    ? globalThis.crypto
    : (await import('crypto')).webcrypto).getRandomValues(new Uint8Array(length));
}
