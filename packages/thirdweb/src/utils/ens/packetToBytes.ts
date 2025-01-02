import { type ByteArray, labelhash } from "viem";
import { stringToBytes } from "../encoding/to-bytes.js";
import { encodeLabelhash } from "./encodeLabelhash.js";

/**
 * Encodes a DNS packet into a ByteArray containing a UDP payload.
 * @param packet
 * @internal
 */
export function packetToBytes(packet: string): ByteArray {
  // strip leading and trailing `.`
  const value = packet.replace(/^\.|\.$/gm, "");
  if (value.length === 0) {
    return new Uint8Array(1);
  }

  const bytes = new Uint8Array(stringToBytes(value).byteLength + 2);

  let offset = 0;
  const list = value.split(".");
  for (let i = 0; i < list.length; i++) {
    const item = list[i] as string;
    let encoded = stringToBytes(item);
    // if the length is > 255, make the encoded label value a labelhash
    // this is compatible with the universal resolver
    if (encoded.byteLength > 255) {
      encoded = stringToBytes(encodeLabelhash(labelhash(item)));
    }
    bytes[offset] = encoded.length;
    bytes.set(encoded, offset + 1);
    offset += encoded.length + 1;
  }

  if (bytes.byteLength !== offset + 1) {
    return bytes.slice(0, offset + 1);
  }

  return bytes;
}
