import { universalCrypto } from "../crypto/aes/lib/universal-crypto.js";
import { uint8ArrayToHex } from "./encoding/hex.js";

/**
 * @internal
 */
export async function uuid() {
  return (await universalCrypto()).randomUUID();
}

/**
 * @internal
 */
export async function randomBytes32() {
  return uint8ArrayToHex(
    (await universalCrypto()).getRandomValues(new Uint8Array(32)),
  );
}
