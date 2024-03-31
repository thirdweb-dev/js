import { universalCrypto } from "../crypto/aes/lib/universal-crypto.js";
import { uint8ArrayToHex } from "./encoding/hex.js";

/**
 * Generates a random UUID.
 * @returns A promise that resolves to a random UUID.
 * @example
 *
 * ```ts
 * import { uuid } from 'thirdweb/utils';
 *
 * const id = await uuid();
 * ```
 */
export async function uuid() {
  return (await universalCrypto()).randomUUID();
}

/**
 * @interal
 */
export async function randomBytes32() {
  return uint8ArrayToHex(
    (await universalCrypto()).getRandomValues(new Uint8Array(32)),
  );
}
