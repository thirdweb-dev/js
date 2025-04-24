import * as ox__Hex from "ox/Hex";
import type { Hex } from "../utils/encoding/hex.js";
import { ERC_6492_MAGIC_VALUE } from "./constants.js";

/**
 * Determines if a signature is compatible with [ERC6492](https://eips.ethereum.org/EIPS/eip-6492)
 *
 * @param {Hex} signature The signature to check for ERC6492 compatibility
 *
 * @returns {boolean} True if the signature is compatible with ERC6492, false otherwise
 *
 * @example
 * ```ts
 * import { isErc6492Signature } from 'thirdweb/auth';
 *
 * const isErc6492 = isErc6492Signature('0x1234567890123456789012345678901234567890');
 * ```
 *
 * @auth
 */
export function isErc6492Signature(signature: Hex): boolean {
  return ox__Hex.slice(signature, -32) === ERC_6492_MAGIC_VALUE;
}
