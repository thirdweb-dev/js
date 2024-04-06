import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "previewMint" function.
 */
export type PreviewMintParams = {
  shares: AbiParameterToPrimitiveType<{
    name: "shares";
    type: "uint256";
    internalType: "uint256";
  }>;
};

export const FN_SELECTOR = "0xb3d7f6b9" as const;
const FN_INPUTS = [
  {
    name: "shares",
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
 * Encodes the parameters for the "previewMint" function.
 * @param options - The options for the previewMint function.
 * @returns The encoded ABI parameters.
 * @extension ERC4626
 * @example
 * ```ts
 * import { encodePreviewMintParams } "thirdweb/extensions/erc4626";
 * const result = encodePreviewMintParams({
 *  shares: ...,
 * });
 * ```
 */
export function encodePreviewMintParams(options: PreviewMintParams) {
  return encodeAbiParameters(FN_INPUTS, [options.shares]);
}

/**
 * Decodes the result of the previewMint function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC4626
 * @example
 * ```ts
 * import { decodePreviewMintResult } from "thirdweb/extensions/erc4626";
 * const result = decodePreviewMintResult("...");
 * ```
 */
export function decodePreviewMintResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "previewMint" function on the contract.
 * @param options - The options for the previewMint function.
 * @returns The parsed result of the function call.
 * @extension ERC4626
 * @example
 * ```ts
 * import { previewMint } from "thirdweb/extensions/erc4626";
 *
 * const result = await previewMint({
 *  shares: ...,
 * });
 *
 * ```
 */
export async function previewMint(
  options: BaseTransactionOptions<PreviewMintParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.shares],
  });
}
