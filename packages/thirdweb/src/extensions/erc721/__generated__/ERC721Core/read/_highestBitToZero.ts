import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "_highestBitToZero" function.
 */
export type _highestBitToZeroParams = {
  value: AbiParameterToPrimitiveType<{
    name: "_value";
    type: "uint256";
    internalType: "uint256";
  }>;
};

const FN_SELECTOR = "0xc3e2a033" as const;
const FN_INPUTS = [
  {
    name: "_value",
    type: "uint256",
    internalType: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "",
    type: "uint256",
    internalType: "uint256",
  },
] as const;

/**
 * Encodes the parameters for the "_highestBitToZero" function.
 * @param options - The options for the _highestBitToZero function.
 * @returns The encoded ABI parameters.
 * @extension ERC721
 * @example
 * ```ts
 * import { encode_highestBitToZeroParams } "thirdweb/extensions/erc721";
 * const result = encode_highestBitToZeroParams({
 *  value: ...,
 * });
 * ```
 */
export function encode_highestBitToZeroParams(
  options: _highestBitToZeroParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.value]);
}

/**
 * Decodes the result of the _highestBitToZero function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC721
 * @example
 * ```ts
 * import { decode_highestBitToZeroResult } from "thirdweb/extensions/erc721";
 * const result = decode_highestBitToZeroResult("...");
 * ```
 */
export function decode_highestBitToZeroResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "_highestBitToZero" function on the contract.
 * @param options - The options for the _highestBitToZero function.
 * @returns The parsed result of the function call.
 * @extension ERC721
 * @example
 * ```ts
 * import { _highestBitToZero } from "thirdweb/extensions/erc721";
 *
 * const result = await _highestBitToZero({
 *  value: ...,
 * });
 *
 * ```
 */
export async function _highestBitToZero(
  options: BaseTransactionOptions<_highestBitToZeroParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.value],
  });
}
