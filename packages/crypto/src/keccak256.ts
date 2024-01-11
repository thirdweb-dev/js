import { keccak_256 } from "js-sha3";

/**
 * Hashes a string or Uint8Array using keccak256.
 * @param value - Value to be hashed.
 * @returns Hash of the value as Uint8Array.
 */
export function keccak256Sync(value: string | Uint8Array): Uint8Array {
  return new Uint8Array(keccak_256.arrayBuffer(value));
}

/**
 * Hashes a string or Uint8Array using keccak256 and returns the result as a hex string.
 * @param value - Value to be hashed.
 * @returns Hash of the value as a hex string.
 */
export function keccak256SyncHex(value: string | Uint8Array): string {
  return keccak_256(value);
}

/**
 * Hashes a string or Uint8Array using keccak256 and returns the result as a hex string prefixed with "0x".
 * @param value - Value to be hashed.
 * @returns Hash of the value as a hex string prefixed with "0x".
 */
export function keccak256SyncHexPrefixed(
  value: string | Uint8Array,
): `0x${string}` {
  // prefix with 0x (this is what ethers.utils.keccak256 does)
  return `0x${keccak256SyncHex(value)}`;
}
