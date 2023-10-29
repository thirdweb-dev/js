import { arrayBuffer } from "../lib/md5";
import { base64ToUint8Array, concatUint8Arrays } from "uint8array-extras";

/**
 * This is an implementation of the CryptoJS AES decryption scheme, without actually relying on crypto-js.
 */

const HEAD_SIZE_DWORD = 2;
const SALT_SIZE_DWORD = 2;

export async function decryptCryptoJSCipherBase64(
  salt: Uint8Array,
  ciphertext: Uint8Array,

  password: string,
  { keySizeDWORD = 256 / 32, ivSizeDWORD = 128 / 32, iterations = 1 } = {},
) {
  const { key, iv } = await dangerouslyDeriveParameters(
    password,
    salt,
    keySizeDWORD,
    ivSizeDWORD,
    iterations,
  );

  try {
    // decrypt ciphertext using key
    const plainBuffer = await crypto.subtle.decrypt(
      { name: "AES-CBC", iv },
      key,
      ciphertext,
    );
    // return the plaintext from ArrayBuffer
    return new TextDecoder().decode(plainBuffer);
  } catch (e) {
    throw new Error("Decrypt failed");
  }
}

export function parseCryptoJSCipherBase64(cryptoJSCipherBase64: string) {
  let salt: Uint8Array | null = null;
  let ciphertext = base64ToUint8Array(cryptoJSCipherBase64);

  const [head, body] = splitUint8Array(ciphertext, HEAD_SIZE_DWORD * 4);

  // This effectively checks if the ciphertext starts with 'Salted__', which is the crypto-js convention.
  const headDataView = new DataView(head.buffer);
  if (
    headDataView.getInt32(0) === 0x53616c74 &&
    headDataView.getInt32(4) === 0x65645f5f
  ) {
    [salt, ciphertext] = splitUint8Array(body, SALT_SIZE_DWORD * 4);
  }

  return { ciphertext, salt };
}

async function dangerouslyDeriveParameters(
  password: string,
  salt: Uint8Array,
  keySizeDWORD: number,
  ivSizeDWORD: number,
  iterations: number,
) {
  const passwordUint8Array = new TextEncoder().encode(password);

  const keyPlusIV = dangerousEVPKDF(
    passwordUint8Array,
    salt,
    keySizeDWORD + ivSizeDWORD,
    iterations,
  );
  const [rawKey, iv] = splitUint8Array(keyPlusIV, keySizeDWORD * 4);

  const key = await crypto.subtle.importKey("raw", rawKey, "AES-CBC", false, [
    "decrypt",
  ]);

  return { key, iv };
}

function dangerousEVPKDF(
  passwordUint8Array: Uint8Array,
  saltUint8Array: Uint8Array,
  keySizeDWORD: number,
  iterations: number,
) {
  let derivedKey = new Uint8Array();
  let block = new Uint8Array();

  while (derivedKey.byteLength < keySizeDWORD * 4) {
    block = new Uint8Array(
      arrayBuffer(
        concatUint8Arrays([block, passwordUint8Array, saltUint8Array]),
      ),
    );

    for (let i = 1; i < iterations; i++) {
      block = new Uint8Array(arrayBuffer(block));
    }

    derivedKey = concatUint8Arrays([derivedKey, block]);
  }

  return derivedKey;
}

function splitUint8Array(a: Uint8Array, i: number) {
  return [a.subarray(0, i), a.subarray(i, a.length)];
}
