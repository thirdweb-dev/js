import { numberToHex, stringToHex } from "../encoding/hex.js";

export function encodeExtraDataWithUri(options: {
  metadataUri: string;
}): string {
  const uriHex = stringToHex(options.metadataUri).replace("0x", "");
  const lengthHex = numberToHex(uriHex.length / 2, { size: 1 }).replace(
    "0x",
    "",
  );

  return uriHex.concat(lengthHex);
}
