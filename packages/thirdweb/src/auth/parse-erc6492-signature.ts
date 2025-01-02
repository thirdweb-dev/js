import { decodeAbiParameters, isErc6492Signature } from "viem";
import type { Hex } from "../utils/encoding/hex.js";
import type { OneOf } from "../utils/type-utils.js";
import type { Erc6492Signature } from "./types.js";

/**
 * @auth
 */
export type ParseErc6492SignatureReturnType = OneOf<
  Erc6492Signature | { signature: Hex }
>;

/**
 * @description Parses a serialized ({@link Hex}) [ERC-6492](https://eips.ethereum.org/EIPS/eip-6492) signature.
 * If the signature is not in ERC-6492 format, the original signature is returned.
 *
 * @param {Hex} signature The signature to parse
 *
 * @returns {@link ParseErc6492SignatureReturnType} The parsed (or original) signature
 *
 * @example
 * ```ts
 * import { parseErc6492Signature } from 'thirdweb/auth';
 *
 * const parsedSignature = parseErc6492Signature('0x1234567890123456789012345678901234567890');
 * ```
 * @auth
 */
export function parseErc6492Signature(
  signature: Hex,
): ParseErc6492SignatureReturnType {
  if (!isErc6492Signature(signature)) {
    return { signature };
  }

  const [address, data, originalSignature] = decodeAbiParameters(
    [{ type: "address" }, { type: "bytes" }, { type: "bytes" }],
    signature,
  );
  return { address: address, data, signature: originalSignature };
}
