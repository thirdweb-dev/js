import { hexToString } from "../encoding/hex.js";

export function decodeUriFromCalldata(options: {
  initCalldata: `0x${string}`;
}): string {
  const lengthHex = options.initCalldata.slice(-2);
  const dataLength = Number.parseInt(lengthHex, 16) * 2;
  const encodedIpfsHex = options.initCalldata.slice(-dataLength - 2, -2);
  const uri = hexToString(`0x${encodedIpfsHex}`);

  if (uri.startsWith("ipfs://")) {
    return uri;
  } else {
    throw new Error("URI not present");
  }
}
