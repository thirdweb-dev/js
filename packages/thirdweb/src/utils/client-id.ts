import { LruMap } from "./caching/lru.js";
import { stringToBytes } from "./encoding/to-bytes.js";
import { sha256 } from "./hashing/sha256.js";

const cache = new LruMap<string>(4096);

/**
 * @param secretKey - the secret key to compute the client id from
 * @returns the 32 char hex client id
 * @internal
 */
export function computeClientIdFromSecretKey(secretKey: string): string {
  if (cache.has(secretKey)) {
    return cache.get(secretKey) as string;
  }
  // we slice off the leading `0x` and then take the first 32 chars
  const cId = sha256(stringToBytes(secretKey)).slice(2, 34);
  cache.set(secretKey, cId);
  return cId;
}
