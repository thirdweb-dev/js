import { universalCrypto } from "../crypto/aes/lib/universal-crypto.js";

/**
 * Generates a random UUID.
 * @returns A promise that resolves to a random UUID.
 * @example
 *
 * ```ts
 * import { uuid } from '@thirdweb-dev/utils';
 *
 * const id = await uuid();
 * ```
 */
export async function uuid() {
  return (await universalCrypto()).randomUUID();
}
