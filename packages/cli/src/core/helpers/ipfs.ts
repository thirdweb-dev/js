import { logger } from "./logger";
import { decodeFirstSync } from "cbor";
import { UnixFS } from "ipfs-unixfs";
import { DAGNode } from "ipld-dag-pb";
import { toB58String } from "multihashes";

/**
 * Derives IPFS hash of string
 * @param  {String} str
 * @return {String}     IPFS hash (ex: "Qm")
 */
export async function getIPFSHash(str: string) {
  const file = new UnixFS({
    type: "file",
    data: Buffer.from(str),
  });
  const node = new DAGNode(file.marshal());
  const metadataLink = await node.toDAGLink();
  return toB58String(metadataLink.Hash.multihash);
}

/**
 * Extract the IPFS hash from the given bytecode
 * @param bytecode
 * @returns
 */
export function extractIPFSHashFromBytecode(
  bytecode: string,
): string | undefined {
  const numericBytecode = hexToBytes(bytecode);
  const cborLength: number =
    numericBytecode[numericBytecode.length - 2] * 0x100 +
    numericBytecode[numericBytecode.length - 1];
  const bytecodeBuffer = Buffer.from(
    numericBytecode.slice(numericBytecode.length - 2 - cborLength, -2),
  );
  const cborData = decodeFirstSync(bytecodeBuffer);
  if (cborData["ipfs"]) {
    const uri = toB58String(cborData["ipfs"]);
    return uri;
  }
  return undefined;
}

function hexToBytes(hex: string | number) {
  hex = hex.toString(16);
  if (!hex.startsWith("0x")) {
    hex = `0x${hex}`;
  }
  if (!isHexStrict(hex)) {
    throw new Error('Given value "' + hex + '" is not a valid hex string.');
  }

  hex = hex.replace(/^0x/i, "");

  for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.slice(c, c + 2), 16));
  return bytes;
}

function isHexStrict(hex: string | number) {
  return (
    (typeof hex === "string" || typeof hex === "number") &&
    /^(-)?0x[0-9a-f]*$/i.test(hex.toString())
  );
}
