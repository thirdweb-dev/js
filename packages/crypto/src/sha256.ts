import { uint8ArrayToHex } from "uint8array-extras";

export function sha256(value: string | BufferSource): Promise<ArrayBuffer> {
  const encodedValue =
    typeof value === "string" ? new TextEncoder().encode(value) : value;
  return crypto.subtle.digest("SHA-256", encodedValue);
}

export async function sha256Hex(value: string | BufferSource): Promise<string> {
  const buffer = await sha256(value);
  return uint8ArrayToHex(new Uint8Array(buffer));
}
