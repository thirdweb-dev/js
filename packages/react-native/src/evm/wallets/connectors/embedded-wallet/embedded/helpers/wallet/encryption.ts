import AesGcmCrypto from "react-native-aes-gcm-crypto";
import { getRandomValues } from "../getRandomValues";
import QuickCrypto from "react-native-quick-crypto";

const ENCRYPTION_SEPARATOR = ":";

export async function getEncryptionKey(
  pwd: string,
  salt: ArrayBuffer,
): Promise<string> {
  const key = QuickCrypto.pbkdf2Sync(pwd, salt, 100000, 256, "sha256");

  // this produces a 256 bytes length key
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
  const keyBase64 = await getEncryptionKey(pwd, salt);

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
  }`;

  return returnValue;
}

export async function decryptShareWeb(
  encryptedShareDetails: string,
  pwd: string,
): Promise<string> {
  const [encryptedShare, iv, salt, tag] =
    encryptedShareDetails.split(ENCRYPTION_SEPARATOR);

  const key = await getEncryptionKey(pwd, base64ToBuffer(salt));

  const normalizedShare = await AesGcmCrypto.decrypt(
    encryptedShare,
    key,
    iv,
    tag,
    false,
  );

  return normalizedShare;
}
