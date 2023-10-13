import AesGcmCrypto from "react-native-aes-gcm-crypto";
import QuickCrypto from "react-native-quick-crypto";
import { getRandomValues } from "../getRandomValues";

const ENCRYPTION_SEPARATOR = ":";
const DEPRECATED_KEY_ITERATION_COUNT = 5000000;
const CURRENT_KEY_ITERATION_COUNT = 650000;
const KEY_LENGTH = 256;

export async function getEncryptionKey(
  pwd: string,
  salt: ArrayBuffer,
  iterationCounts: number,
): Promise<string> {
  const key = QuickCrypto.pbkdf2Sync(
    pwd,
    salt,
    iterationCounts,
    KEY_LENGTH,
    "sha256",
  );

  // this produces a 256 bits length key
  // but node by default produces a 32 byte length key
  const key32 = key.slice(0, 32);

  const base64key = key32.toString("base64");

  return base64key;
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
  const cipherTextBase64Buffer = Buffer.from(encryptedValue.content, "base64");
  // Tag is a hex string
  const tagHexBuffer = Buffer.from(encryptedValue.tag, "hex");
  const cipherTextWithTag = Buffer.concat([
    cipherTextBase64Buffer,
    tagHexBuffer,
  ]);
  // iv is a hex string
  const ivBase64 = Buffer.from(encryptedValue.iv, "hex").toString("base64");

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

  const encryptedShareWithTagBuffer = Buffer.from(
    encryptedShareWithTagBase64,
    "base64",
  );

  // The tag is a 16 bytes long hex string
  const tagBytesLength = 16;
  const cipherTextBufferLength =
    encryptedShareWithTagBuffer.length - tagBytesLength;

  // Get cipherText and tag from encryptedShareWithTagBuffer
  const cipherTextBuffer = Buffer.from(
    encryptedShareWithTagBuffer.subarray(0, cipherTextBufferLength),
  );
  const tagBuffer = Buffer.from(
    encryptedShareWithTagBuffer.subarray(cipherTextBufferLength),
  );

  const originalBase64CipherText = cipherTextBuffer.toString("base64");
  // converting to hex since the decrypt function expects a hex string
  // Ref: https://github.com/craftzdog/react-native-aes-gcm-crypto/blob/master/android/src/main/java/com/reactnativeaesgcmcrypto/AesGcmCryptoModule.kt#L111
  const hexStringTag = tagBuffer.toString("hex");

  // converting to hex since the decrypt function expects a hex string
  // Ref: https://github.com/craftzdog/react-native-aes-gcm-crypto/blob/master/android/src/main/java/com/reactnativeaesgcmcrypto/AesGcmCryptoModule.kt#L111
  const ivBufferHex = Buffer.from(ivBase64, "base64").toString("hex");

  const normalizedShare = await AesGcmCrypto.decrypt(
    originalBase64CipherText,
    key,
    ivBufferHex,
    hexStringTag,
    false,
  );

  return normalizedShare;
}
