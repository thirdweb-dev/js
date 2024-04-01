import { universalCrypto } from "../crypto/aes/lib/universal-crypto.js";
import { uint8ArrayToHex } from "./encoding/hex.js";

/**
 * @intenal
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
