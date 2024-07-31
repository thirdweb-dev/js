import AesGcmCrypto from "react-native-aes-gcm-crypto";
import QuickCrypto from "react-native-quick-crypto";
import { concat } from "viem/utils";
import {
  hexToUint8Array,
  uint8ArrayToHex,
} from "../../../../../utils/encoding/hex.js";
import { randomBytesBuffer } from "../../../../../utils/random.js";
import {
  base64ToUint8Array,
  uint8ArrayToBase64,
} from "../../../../../utils/uint8-array.js";

const ENCRYPTION_SEPARATOR = ":";
const DEPRECATED_KEY_ITERATION_COUNT = 5000000;
const CURRENT_KEY_ITERATION_COUNT = 650000;
const KEY_LENGTH = 256;

export async function getEncryptionKey(
  pwd: string,
  salt: Uint8Array,
  iterationCounts: number,
): Promise<string> {
  // @ts-ignore - default import buils but ts doesn't like it
  const key: ArrayBuffer = QuickCrypto.pbkdf2Sync(
    pwd,
    salt.buffer as ArrayBuffer,
    iterationCounts,
    KEY_LENGTH,
    "SHA-256",
  );

  // this produces a 256 bits length key
  // but node by default produces a 32 byte length key
  const key32 = key.slice(0, 32);

  const base64key = uint8ArrayToBase64(new Uint8Array(key32));

  return base64key;
}

export async function encryptShareWeb(
  share: string,
  pwd: string,
): Promise<string> {
  const salt = randomBytesBuffer(16);
  const iterationCount = CURRENT_KEY_ITERATION_COUNT;

  const keyBase64 = await getEncryptionKey(pwd, salt, iterationCount);

  // biome-ignore lint/suspicious/noExplicitAny: Can't import the types properly
  let encryptedValue: any;
  try {
    // @ts-ignore - default import buils but ts doesn't like it
    encryptedValue = await AesGcmCrypto.encrypt(share, false, keyBase64);
  } catch (error) {
    throw new Error(`Error encrypting share: ${error}`);
  }

  // Ref: https://github.com/craftzdog/react-native-aes-gcm-crypto/blob/master/android/src/main/java/com/reactnativeaesgcmcrypto/AesGcmCryptoModule.kt#L111
  // Cipher text is a base64 string
  const cipherTextBase64Buffer = base64ToUint8Array(encryptedValue.content);
  // Tag is a hex string
  const tagHexBuffer = hexToUint8Array(`0x${encryptedValue.tag}`);
  const cipherTextWithTag = concat([cipherTextBase64Buffer, tagHexBuffer]);
  // iv is a hex string
  const ivBase64 = uint8ArrayToBase64(
    hexToUint8Array(`0x${encryptedValue.iv}`),
  );

  const returnValue = `${uint8ArrayToBase64(
    cipherTextWithTag,
  )}${ENCRYPTION_SEPARATOR}${ivBase64}${ENCRYPTION_SEPARATOR}${uint8ArrayToBase64(
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
    ? Number.parseInt(maybeIterationCount)
    : undefined;
  if (!iterationCount) {
    iterationCount = DEPRECATED_KEY_ITERATION_COUNT;
  }

  const key = await getEncryptionKey(
    pwd,
    // biome-ignore lint/style/noNonNullAssertion: its there
    base64ToUint8Array(saltBase64!),
    iterationCount,
  );

  const encryptedShareWithTagBuffer = base64ToUint8Array(
    // biome-ignore lint/style/noNonNullAssertion: its there
    encryptedShareWithTagBase64!,
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
  // biome-ignore lint/style/noNonNullAssertion: it's there
  const ivBufferHex = uint8ArrayToHex(base64ToUint8Array(ivBase64!));

  // @ts-ignore - default import builds but ts doesn't like it
  const normalizedShare = await AesGcmCrypto.decrypt(
    originalBase64CipherText,
    key,
    ivBufferHex.slice(2), // lib expects hex with no 0x prefix
    hexStringTag.slice(2),
    false,
  );

  return normalizedShare;
}
