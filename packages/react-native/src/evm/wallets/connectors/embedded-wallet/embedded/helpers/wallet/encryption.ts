import AesGcmCrypto from "react-native-aes-gcm-crypto";
import QuickCrypto from "react-native-quick-crypto";
import { getRandomValues } from "../getRandomValues";
import {
  uint8ArrayToBase64,
  uint8ArrayToHex,
  base64ToUint8Array,
  hexToUint8Array,
  concatUint8Arrays,
} from "uint8array-extras";

const ENCRYPTION_SEPARATOR = ":";
const DEPRECATED_KEY_ITERATION_COUNT = 5000000;
const CURRENT_KEY_ITERATION_COUNT = 650000;
const KEY_LENGTH = 256;

export async function getEncryptionKey(
  pwd: string,
  salt: ArrayBuffer,
  iterationCounts: number,
): Promise<string> {
  // a buffer *is* a uint8 array and we would like to operate on uint8 arrays
  const key: Uint8Array = QuickCrypto.pbkdf2Sync(
    pwd,
    salt,
    iterationCounts,
    KEY_LENGTH,
    "sha256",
  );

  // this produces a 256 bits length key
  // but node by default produces a 32 byte length key
  // subarray does what buffer.slice() always did but explicitly
  const key32 = key.subarray(0, 32);

  const base64key = uint8ArrayToBase64(key32);

  return base64key;
}

function bufferToBase64(arrayBuffer: ArrayBuffer): string {
  return uint8ArrayToBase64(new Uint8Array(arrayBuffer));
}

function base64ToBuffer(base64String: string): Uint8Array {
  return base64ToUint8Array(base64String);
}

export async function encryptShareWeb(
  share: string,
  pwd: string,
): Promise<string> {
  const salt = getRandomValues(new Uint8Array(16));
  const iterationCount = CURRENT_KEY_ITERATION_COUNT;

  const keyBase64 = await getEncryptionKey(pwd, salt, iterationCount);

  let encryptedValue;
  try {
    encryptedValue = await AesGcmCrypto.encrypt(share, false, keyBase64);
  } catch (error) {
    throw new Error(`Error encrypting share: ${error}`);
  }

  // Ref: https://github.com/craftzdog/react-native-aes-gcm-crypto/blob/master/android/src/main/java/com/reactnativeaesgcmcrypto/AesGcmCryptoModule.kt#L111
  // Cipher text is a base64 string
  const cipherTextBase64Buffer = base64ToUint8Array(encryptedValue.content);
  // Tag is a hex string
  const tagHexBuffer = hexToUint8Array(encryptedValue.tag);
  const cipherTextWithTag = concatUint8Arrays([
    cipherTextBase64Buffer,
    tagHexBuffer,
  ]);
  // iv is a hex string
  const ivBase64 = uint8ArrayToBase64(hexToUint8Array(encryptedValue.iv));

  const returnValue = `${bufferToBase64(
    cipherTextWithTag,
  )}${ENCRYPTION_SEPARATOR}${ivBase64}${ENCRYPTION_SEPARATOR}${bufferToBase64(
    salt,
  )}${ENCRYPTION_SEPARATOR}${iterationCount}`;

  return returnValue;
}

export async function decryptShareWeb(
  encryptedShareDetails: string,
  pwd: string,
): Promise<string> {
  const [
    encryptedShareWithTagBase64,
    ivBase64,
    saltBase64,
    maybeIterationCount,
  ] = encryptedShareDetails.split(ENCRYPTION_SEPARATOR);

  let iterationCount = maybeIterationCount
    ? parseInt(maybeIterationCount)
    : undefined;
  if (!iterationCount) {
    iterationCount = DEPRECATED_KEY_ITERATION_COUNT;
  }

  const key = await getEncryptionKey(
    pwd,
    base64ToBuffer(saltBase64),
    iterationCount,
  );

  const encryptedShareWithTagBuffer = base64ToUint8Array(
    encryptedShareWithTagBase64,
  );

  // The tag is a 16 bytes long hex string
  const tagBytesLength = 16;
  const cipherTextBufferLength =
    encryptedShareWithTagBuffer.length - tagBytesLength;

  // Get cipherText and tag from encryptedShareWithTagBuffer
  const cipherTextBuffer = encryptedShareWithTagBuffer.subarray(
    0,
    cipherTextBufferLength,
  );

  const tagBuffer = encryptedShareWithTagBuffer.subarray(
    cipherTextBufferLength,
  );

  const originalBase64CipherText = uint8ArrayToBase64(cipherTextBuffer);
  // converting to hex since the decrypt function expects a hex string
  // Ref: https://github.com/craftzdog/react-native-aes-gcm-crypto/blob/master/android/src/main/java/com/reactnativeaesgcmcrypto/AesGcmCryptoModule.kt#L111
  const hexStringTag = uint8ArrayToHex(tagBuffer);

  // converting to hex since the decrypt function expects a hex string
  // Ref: https://github.com/craftzdog/react-native-aes-gcm-crypto/blob/master/android/src/main/java/com/reactnativeaesgcmcrypto/AesGcmCryptoModule.kt#L111
  const ivBufferHex = uint8ArrayToHex(base64ToUint8Array(ivBase64));

  const normalizedShare = await AesGcmCrypto.decrypt(
    originalBase64CipherText,
    key,
    ivBufferHex,
    hexStringTag,
    false,
  );

  return normalizedShare;
}
