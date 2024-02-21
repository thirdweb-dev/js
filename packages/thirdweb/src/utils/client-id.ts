import { sha256 } from "@noble/hashes/sha256";
import { uint8ArrayToHex } from "./hex.js";

/**
 * @param secretKey - the secret key to compute the client id from
 * @returns the 32 char hex client id
 * @internal
 */
export function computeClientIdFromSecretKey(secretKey: string) {
  // we slice off the leading `0x` and then take the first 32 chars
  return uint8ArrayToHex(sha256(secretKey)).slice(2, 34);
}
