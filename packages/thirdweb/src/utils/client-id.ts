import { sha256HexSync } from "@thirdweb-dev/crypto";

/**
 * @param secretKey - the secret key to compute the client id from
 * @returns the 32 char hex client id
 * @internal
 */
export function computeClientIdFromSecretKey(secretKey: string) {
  return sha256HexSync(secretKey).slice(0, 32);
}
