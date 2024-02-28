import type {
  LocalWalletDecryptOptions,
  LocalWalletEncryptOptions,
} from "./types.js";

/**
 * @internal
 */
export function isValidPrivateKey(value: string) {
  return !!value.match(/^(0x)?[0-9a-f]{64}$/i);
}

/**
 * if encryption object is provided
 *  - use encryption.decrypt function if given, else return the default decrypt function
 * if encryption object is not provided
 * - return a noop function
 * @internal
 */
export function getDecryptionFunction(
  encryption: LocalWalletDecryptOptions | undefined,
) {
  return async (msg: string) => {
    if (!encryption) {
      return msg;
    }

    if (encryption.decrypt) {
      return encryption.decrypt(msg, encryption.password);
    }

    const { aesDecryptCompat } = await import("../../crypto/aes/decrypt.js");
    return aesDecryptCompat(msg, encryption.password);
  };
}

/**
 * if encryption object is provided - use encryption.encrypt function if given, else use default encrypt function
 * if no encryption object is provided - do not encrypt
 * @internal
 */
export function getEncryptionFunction(
  encryption: LocalWalletEncryptOptions | undefined,
) {
  return async (msg: string) => {
    if (!encryption) {
      return msg;
    }

    if (encryption.encrypt) {
      return encryption.encrypt(msg, encryption.password);
    }

    const { aesEncrypt } = await import("../../crypto/aes/encrypt.js");
    return aesEncrypt(msg, encryption.password);
  };
}
