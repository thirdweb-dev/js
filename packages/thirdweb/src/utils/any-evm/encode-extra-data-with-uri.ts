import { encodePacked } from "ox/AbiParameters";
import { numberToHex, stringToHex } from "../encoding/hex.js";

export function encodeExtraDataWithUri(options: { metadataUri: string }) {
  const uriHex = stringToHex(options.metadataUri);
  const lengthHex = numberToHex(uriHex.replace("0x", "").length / 2, {
    size: 1,
  });

  return encodePacked(["bytes", "bytes"], [uriHex, lengthHex]);
}
