import { sha256 as sha256Noble } from "@noble/hashes/sha256";
import { uint8ArrayToHex } from "uint8array-extras";

/**
 * Hash a string or Uint8Array using sha256.
 * @param value - Value to be hashed.
 * @returns A promise that resolves to the hash of the value as Uint8Array.
 */
export async function sha256(
  value: string | BufferSource,
): Promise<Uint8Array> {
  const encodedValue =
    typeof value === "string" ? new TextEncoder().encode(value) : value;
  return new Uint8Array(await crypto.subtle.digest("SHA-256", encodedValue));
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
