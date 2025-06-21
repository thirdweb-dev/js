import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "previewMint" function.
 */
export type PreviewMintParams = {
  shares: AbiParameterToPrimitiveType<{ type: "uint256"; name: "shares" }>;
};

export const FN_SELECTOR = "0xb3d7f6b9" as const;
const FN_INPUTS = [
  {
    name: "shares",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Checks if the `previewMint` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `previewMint` method is supported.
 * @extension ERC4626
 * @example
 * ```ts
 * import { isPreviewMintSupported } from "thirdweb/extensions/erc4626";
 * const supported = isPreviewMintSupported(["0x..."]);
 * ```
 */
export function isPreviewMintSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "previewMint" function.
 * @param options - The options for the previewMint function.
 * @returns The encoded ABI parameters.
 * @extension ERC4626
 * @example
 * ```ts
 * import { encodePreviewMintParams } from "thirdweb/extensions/erc4626";
 * const result = encodePreviewMintParams({
 *  shares: ...,
 * });
 * ```
 */
export function encodePreviewMintParams(options: PreviewMintParams) {
  return encodeAbiParameters(FN_INPUTS, [options.shares]);
}

/**
 * Encodes the "previewMint" function into a Hex string with its parameters.
 * @param options - The options for the previewMint function.
 * @returns The encoded hexadecimal string.
 * @extension ERC4626
 * @example
 * ```ts
 * import { encodePreviewMint } from "thirdweb/extensions/erc4626";
 * const result = encodePreviewMint({
 *  shares: ...,
 * });
 * ```
 */
export function encodePreviewMint(options: PreviewMintParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodePreviewMintParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the previewMint function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC4626
 * @example
 * ```ts
 * import { decodePreviewMintResult } from "thirdweb/extensions/erc4626";
 * const result = decodePreviewMintResultResult("...");
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
 *  contract,
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
