import { keccak_256 } from "js-sha3";

export function keccak256Sync(value: string | Uint8Array) {
  return new Uint8Array(keccak_256.arrayBuffer(value));
}

export function keccak256SyncHex(value: string | Uint8Array) {
  // prefix with 0x
  return "0x" + keccak_256(value);
}
