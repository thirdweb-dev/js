import { hexToBytes } from "@noble/hashes/utils";

import { decode } from "./cbor-decode.js";
import { base58Encode } from "../base58/encode.js";

/**
 * Extracts the IPFS URI from the given bytecode.
 * @param bytecode - The bytecode to extract the IPFS URI from.
 * @returns The IPFS URI if found, otherwise undefined.
 * @example
 * ```ts
 * import { extractIPFSUri } from "thirdweb/utils/bytecode/extractIPFS";
 * const bytecode = "0x363d3d373d3d3d363d30545af43d82803e903d91601857fd5bf3";
 * const ipfsHash = extractIPFSUri(bytecode);
 * console.log(ipfsHash);
 * ```
 */
export function extractIPFSUri(bytecode: string): string | undefined {
  const numericBytecode = hexToBytes(
    bytecode.startsWith("0x") ? bytecode.slice(2) : bytecode,
  );

  const cborLength =
    // @ts-expect-error - TS doesn't like this, but it's fine
    numericBytecode[numericBytecode.length - 2] * 0x100 +
    // @ts-expect-error - TS doesn't like this, but it's fine
    numericBytecode[numericBytecode.length - 1];
  const cborStart = numericBytecode.length - 2 - cborLength;
  // if the cborStart is invalid, return undefined
  if (cborStart < 0 || cborStart > numericBytecode.length) {
    return undefined;
  }
  const bytecodeBuffer = numericBytecode.slice(cborStart, -2);

  const cborData = decode(bytecodeBuffer);
  if ("ipfs" in cborData) {
    return `ipfs://${base58Encode(cborData["ipfs"])}`;
  }

  return undefined;
}
