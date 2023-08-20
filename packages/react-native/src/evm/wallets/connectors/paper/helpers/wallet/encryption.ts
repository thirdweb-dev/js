import crypto from "crypto";

const ENCRYPTION_SEPARATOR = ":";

// Client Side Share encryption and decryption
function getKeyMaterial(pwd: string) {
  const enc = new TextEncoder();
  return crypto.subtle.importKey("raw", enc.encode(pwd), "PBKDF2", false, [
    "deriveBits",
    "deriveKey",
  ]);
}

async function getEncryptionKey(pwd: string, salt: ArrayBuffer) {
  const keyMaterial = await getKeyMaterial(pwd);
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"],
  );
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
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await getEncryptionKey(pwd, salt);

  const normalizedShare = new TextEncoder().encode(share);

  // why 12 bytes for iv https://crypto.stackexchange.com/questions/41601/aes-gcm-recommended-iv-size-why-12-bytes
  const iv = crypto.getRandomValues(new Uint8Array(12));
  // https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/encrypt
  const encryptedValue = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    normalizedShare,
  );

  return `${bufferToBase64(
    encryptedValue,
  )}${ENCRYPTION_SEPARATOR}${bufferToBase64(
    iv,
  )}${ENCRYPTION_SEPARATOR}${bufferToBase64(salt)}`;
}

export async function decryptShareWeb(
  encryptedShareDetails: string,
  pwd: string,
): Promise<string> {
  const [encryptedShare, iv, salt] =
    encryptedShareDetails.split(ENCRYPTION_SEPARATOR);

  const key = await getEncryptionKey(pwd, base64ToBuffer(salt));

  const normalizedEncryptedShare = base64ToBuffer(encryptedShare);
  const normalizedShare = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: base64ToBuffer(iv),
    },
    key,
    normalizedEncryptedShare,
  );

  const result = new TextDecoder().decode(normalizedShare);
  return result;
}
