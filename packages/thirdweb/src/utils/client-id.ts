import { sha256 } from "@noble/hashes/sha256";
import { uint8ArrayToHex } from "./hex.js";

/**
 * @param secretKey - the secret key to compute the client id from
 * @returns the 32 char hex client id
 * @internal
 */
export function computeClientIdFromSecretKey(secretKey: string) {
  return uint8ArrayToHex(sha256(secretKey)).slice(0, 32);
}
