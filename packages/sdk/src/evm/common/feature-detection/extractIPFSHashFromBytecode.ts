import { decode } from "../../lib/cbor-decode.js";
import bs58 from "bs58";
import { hexToBytes } from "./hexToBytes";

/**
 * @internal
 * @param bytecode - The bytecode to extract the IPFS hash from
 */
export function extractIPFSHashFromBytecode(
  bytecode: string,
): string | undefined {
  const numericBytecode = hexToBytes(bytecode);
  const cborLength: number =
    numericBytecode[numericBytecode.length - 2] * 0x100 +
    numericBytecode[numericBytecode.length - 1];
  const bytecodeBuffer = Uint8Array.from(
    numericBytecode.slice(numericBytecode.length - 2 - cborLength, -2),
  );

  const cborData = decode(bytecodeBuffer);
  if ("ipfs" in cborData && cborData["ipfs"]) {
    try {
      return `ipfs://${bs58.encode(cborData["ipfs"])}`;
    } catch (e) {
      console.warn("feature-detection ipfs cbor failed", e);
    }
  }
  return undefined;
}
