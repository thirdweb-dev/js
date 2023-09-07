import Aes from "react-native-aes-crypto";
import AesGcmCrypto from "react-native-aes-gcm-crypto";
import { getRandomValues } from "../getRandomValues";

// const {Crypto} = require('@peculiar/webcrypto');
// const crypto = new Crypto();

const ENCRYPTION_SEPARATOR = ":";

// Client Side Share encryption and decryption
// export function getKeyMaterial(pwd: string) {
//   const enc = new TextEncoder();
//   console.log('Calling importKey', pwd);
//   return crypto.subtle.importKey('raw', enc.encode(pwd), 'PBKDF2', false, [
//     'deriveBits',
//     'deriveKey',
//   ]);
// }

export async function getEncryptionKey(pwd: string, salt: ArrayBuffer) {
  // const keyMaterial = await getKeyMaterial(pwd);
  // console.log('Calling deriveKey', pwd);
  // return crypto.subtle.deriveKey(
  //   {
  //     name: 'PBKDF2',
  //     salt,
  //     iterations: 100000,
  //     hash: 'SHA-256',
  //   },
  //   keyMaterial,
  //   {name: 'AES-GCM', length: 256},
  //   true,
  //   ['encrypt', 'decrypt'],
  // );
  return Aes.pbkdf2(pwd, bufferToBase64(salt), 100000, 256, "sha256");
}

function bufferToBase64(arrayBuffer: ArrayBuffer): string {
  return Buffer.from(arrayBuffer).toString("base64");
}

function base64ToBuffer(base64String: string): ArrayBuffer {
  return Buffer.from(base64String, "base64");
}

export async function encryptShareWeb(
  share: string,
  pwd: string,
): Promise<string> {
  // console.log("share", share);
  const normalizedShare = new TextEncoder().encode(share);

  // why 12 bytes for iv https://crypto.stackexchange.com/questions/41601/aes-gcm-recommended-iv-size-why-12-bytes
  const salt = getRandomValues(new Uint8Array(12));
  const key = await getEncryptionKey(pwd, salt);
  const keyBase64 = Buffer.from(key).toString("base64");

  console.log("Calling encrypt:", pwd, keyBase64, salt, normalizedShare);

  const encryptedValue = await AesGcmCrypto.encrypt(
    bufferToBase64(normalizedShare),
    false,
    keyBase64,
  );
  // const encryptedValue = await crypto.subtle.encrypt(
  //   {name: 'AES-GCM', iv},
  //   key,
  //   normalizedShare,
  // );

  // console.log("Calling bufferToBase64", pwd);

  const returnValue = `${encryptedValue.content}${ENCRYPTION_SEPARATOR}${
    encryptedValue.iv
  }${ENCRYPTION_SEPARATOR}${bufferToBase64(salt)}${ENCRYPTION_SEPARATOR}${
    encryptedValue.tag
  }`;

  // console.log("returnValue", returnValue);

  return returnValue;
}

export async function decryptShareWeb(
  encryptedShareDetails: string,
  pwd: string,
): Promise<string> {
  const [encryptedShare, iv, salt, tag] =
    encryptedShareDetails.split(ENCRYPTION_SEPARATOR);

  const key = await getEncryptionKey(pwd, base64ToBuffer(salt));

  console.log("Calling decrypt", pwd);
  const normalizedShare = await AesGcmCrypto.decrypt(
    encryptedShare,
    key,
    iv,
    tag,
    false,
  );
  // const normalizedShare = await crypto.subtle.decrypt(
  //   {
  //     name: 'AES-GCM',
  //     iv: base64ToBuffer(iv),
  //   },
  //   key,
  //   normalizedEncryptedShare,
  // );
  // const result = new TextDecoder().decode(normalizedShare);

  console.log("decrypted share", normalizedShare);

  return normalizedShare;
}
