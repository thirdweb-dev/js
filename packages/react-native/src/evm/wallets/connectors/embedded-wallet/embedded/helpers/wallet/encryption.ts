import AesGcmCrypto from "react-native-aes-gcm-crypto";
import QuickCrypto from "react-native-quick-crypto";
import { getRandomValues } from "../getRandomValues";

const ENCRYPTION_SEPARATOR = ":";
const DEPRECATED_KEY_ITERATION_COUNT = 5_000_000;
const CURRENT_KEY_ITERATION_COUNT = 650_000;
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
  const keyBase64 = await getEncryptionKey(
    pwd,
    salt,
    CURRENT_KEY_ITERATION_COUNT,
  );

  let encryptedValue;
  try {
    encryptedValue = await AesGcmCrypto.encrypt(share, false, keyBase64);
  } catch (error) {
    throw new Error(`Error encrypting share: ${error}`);
  }

  const returnValue = `${encryptedValue.content}${ENCRYPTION_SEPARATOR}${
    encryptedValue.iv
  }${ENCRYPTION_SEPARATOR}${bufferToBase64(salt)}${ENCRYPTION_SEPARATOR}${
    encryptedValue.tag
  }${ENCRYPTION_SEPARATOR}${CURRENT_KEY_ITERATION_COUNT}}`;

  return returnValue;
}

export async function decryptShareWeb(
  encryptedShareDetails: string,
  pwd: string,
): Promise<string> {
  const [encryptedShare, iv, salt, tag, maybeIterationCount] =
    encryptedShareDetails.split(ENCRYPTION_SEPARATOR);

  const iterationCount = maybeIterationCount
    ? parseInt(maybeIterationCount)
    : DEPRECATED_KEY_ITERATION_COUNT;

  const key = await getEncryptionKey(pwd, base64ToBuffer(salt), iterationCount);

  const normalizedShare = await AesGcmCrypto.decrypt(
    encryptedShare,
    key,
    iv,
    tag,
    false,
  );

  return normalizedShare;
}
