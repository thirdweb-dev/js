import * as ox__AbiParameters from "ox/AbiParameters";
import * as ox__Address from "ox/Address";
import { WrappedSignature as ox__WrappedSignature } from "ox/erc6492";
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
 * Parses a serialized ({@link Hex}) [ERC-6492](https://eips.ethereum.org/EIPS/eip-6492) signature.
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
  if (!ox__WrappedSignature.validate(signature)) {
    return { signature };
  }

  const [address, data, originalSignature] = ox__AbiParameters.decode(
    [{ type: "address" }, { type: "bytes" }, { type: "bytes" }],
    signature,
  );
  return {
    address: ox__Address.checksum(address),
    data,
    signature: originalSignature,
  };
}
