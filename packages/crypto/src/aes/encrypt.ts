import { concatUint8Arrays, uint8ArrayToBase64 } from "uint8array-extras";
import { getCachedTextEncoder } from "../utils/cache";

/**
 * Encrypts plaintext using AES-GCM with supplied password, for decryption with aesDecrypt().
 *
 * @param plaintext - Plaintext to be encrypted.
 * @param password - Password to use to encrypt plaintext.
 * @returns Encrypted ciphertext.
 *
 * @example
 *   const ciphertext = await aesEncrypt('my secret text', 'pw');
 */
export async function aesEncrypt(
  plaintext: string,
  password: string,
): Promise<string> {
  const textEncoder = getCachedTextEncoder();
  // encode password as UTF-8
  const pwUtf8 = textEncoder.encode(password);
  // hash the password
  const pwHash = await crypto.subtle.digest("SHA-256", pwUtf8);

  // get 96-bit random iv
  const iv = crypto.getRandomValues(new Uint8Array(12));

  // specify algorithm to use
  const alg = { name: "AES-GCM", iv };

  // generate key from pw
  const key = await crypto.subtle.importKey("raw", pwHash, alg, false, [
    "encrypt",
  ]);

  // encode plaintext as UTF-8
  const ptUint8 = textEncoder.encode(plaintext);
  // encrypt plaintext using key
  const ctBuffer = await crypto.subtle.encrypt(alg, key, ptUint8);

  // iv+ciphertext base64-encoded
  return uint8ArrayToBase64(concatUint8Arrays([iv, new Uint8Array(ctBuffer)]));
}
