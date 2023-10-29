import { sha256 as sha256Noble } from "@noble/hashes/sha256";
import { uint8ArrayToHex } from "uint8array-extras";

export async function sha256(
  value: string | BufferSource,
): Promise<Uint8Array> {
  const encodedValue =
    typeof value === "string" ? new TextEncoder().encode(value) : value;
  return new Uint8Array(await crypto.subtle.digest("SHA-256", encodedValue));
}

export async function sha256Hex(value: string | BufferSource): Promise<string> {
  return "0x" + uint8ArrayToHex(await sha256(value));
}

export function sha256Sync(value: string | Uint8Array): Uint8Array {
  return sha256Noble(value);
}

export function sha256HexSync(value: string | Uint8Array): string {
  return "0x" + uint8ArrayToHex(sha256Sync(value));
}
