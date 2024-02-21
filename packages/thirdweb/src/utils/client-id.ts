import { stringToBytes } from "./encoding/to-bytes.js";
import { sha256 } from "./hashing/sha256.js";

/**
 * @param secretKey - the secret key to compute the client id from
 * @returns the 32 char hex client id
 * @internal
 */
export function computeClientIdFromSecretKey(secretKey: string) {
  // we slice off the leading `0x` and then take the first 32 chars
  return sha256(stringToBytes(secretKey)).slice(2, 34);
}
