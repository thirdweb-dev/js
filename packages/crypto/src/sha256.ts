import { sha256 as sha256Noble } from "@noble/hashes/sha256";
import { uint8ArrayToHex } from "./utils/uint8array-extras";
import { getCachedTextEncoder } from "./utils/cache";
import { universalCrypto } from "./utils/universal-crypto";

/**
 * Hash a string or Uint8Array using sha256.
 * @param value - Value to be hashed.
 * @returns A promise that resolves to the hash of the value as Uint8Array.
 */
export async function sha256(
  value: string | BufferSource,
): Promise<Uint8Array> {
  let encodedValue;
  if (typeof value === "string") {
    // if we do not have a cahced TextEncoder instance, create one

    encodedValue = getCachedTextEncoder().encode(value);
  } else {
    encodedValue = value;
  }

  return new Uint8Array(
    await (await universalCrypto()).subtle.digest("SHA-256", encodedValue),
  );
}

/**
 * Hash a string or Uint8Array using sha256 and returns the result as a hex string.
 * @param value - Value to be hashed.
 * @returns A promise that resolves to the hash of the value as a hex string.
 */
export async function sha256Hex(value: string | BufferSource): Promise<string> {
  return uint8ArrayToHex(await sha256(value));
}

/**
 * Hash a string or Uint8Array using sha256.
 * @param value - Value to be hashed.
 * @returns The hash of the value as Uint8Array.
 */
export function sha256Sync(value: string | Uint8Array): Uint8Array {
  return sha256Noble(value);
}

/**
 * Hash a string or Uint8Array using sha256.
 * @param value - Value to be hashed.
 * @returns The hash of the value as a hex string.
 */
export function sha256HexSync(value: string | Uint8Array): string {
  return uint8ArrayToHex(sha256Sync(value));
}
