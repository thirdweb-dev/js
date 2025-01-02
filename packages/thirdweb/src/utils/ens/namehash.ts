import { bytesToHex, concat } from "viem/utils";
import { stringToBytes, toBytes } from "../encoding/to-bytes.js";
import { keccak256 } from "../hashing/keccak256.js";
import { encodedLabelToLabelhash } from "./encodeLabelToLabelhash.js";

/**
 * @internal
 */
export function namehash(name: string) {
  let result = new Uint8Array(32).fill(0);
  if (!name) {
    return bytesToHex(result);
  }

  const labels = name.split(".");
  // Iterate in reverse order building up hash
  for (let i = labels.length - 1; i >= 0; i -= 1) {
    const item = labels[i] as string;
    const hashFromEncodedLabel = encodedLabelToLabelhash(item);
    const hashed = hashFromEncodedLabel
      ? toBytes(hashFromEncodedLabel)
      : keccak256(stringToBytes(item), "bytes");
    result = keccak256(concat([result, hashed]), "bytes");
  }

  return bytesToHex(result);
}
