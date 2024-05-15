import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "previewWithdraw" function.
 */
export type PreviewWithdrawParams = {
  assets: AbiParameterToPrimitiveType<{
    name: "assets";
    type: "uint256";
    internalType: "uint256";
  }>;
};

export const FN_SELECTOR = "0x0a28a477" as const;
const FN_INPUTS = [
  {
    name: "assets",
    type: "uint256",
    internalType: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "shares",
    type: "uint256",
    internalType: "uint256",
  },
] as const;

/**
 * Checks if the `previewWithdraw` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `previewWithdraw` method is supported.
 * @extension ERC4626
 * @example
 * ```ts
 * import { isPreviewWithdrawSupported } from "thirdweb/extensions/erc4626";
 *
 * const supported = await isPreviewWithdrawSupported(contract);
 * ```
 */
export async function isPreviewWithdrawSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "previewWithdraw" function.
 * @param options - The options for the previewWithdraw function.
 * @returns The encoded ABI parameters.
 * @extension ERC4626
 * @example
 * ```ts
 * import { encodePreviewWithdrawParams } "thirdweb/extensions/erc4626";
 * const result = encodePreviewWithdrawParams({
 *  assets: ...,
 * });
 * ```
 */
export function encodePreviewWithdrawParams(options: PreviewWithdrawParams) {
  return encodeAbiParameters(FN_INPUTS, [options.assets]);
}

/**
 * Encodes the "previewWithdraw" function into a Hex string with its parameters.
 * @param options - The options for the previewWithdraw function.
 * @returns The encoded hexadecimal string.
 * @extension ERC4626
 * @example
 * ```ts
 * import { encodePreviewWithdraw } "thirdweb/extensions/erc4626";
 * const result = encodePreviewWithdraw({
 *  assets: ...,
 * });
 * ```
 */
export function encodePreviewWithdraw(options: PreviewWithdrawParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodePreviewWithdrawParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the previewWithdraw function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC4626
 * @example
 * ```ts
 * import { decodePreviewWithdrawResult } from "thirdweb/extensions/erc4626";
 * const result = decodePreviewWithdrawResult("...");
 * ```
 */
export function decodePreviewWithdrawResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "previewWithdraw" function on the contract.
 * @param options - The options for the previewWithdraw function.
 * @returns The parsed result of the function call.
 * @extension ERC4626
 * @example
 * ```ts
 * import { previewWithdraw } from "thirdweb/extensions/erc4626";
 *
 * const result = await previewWithdraw({
 *  contract,
 *  assets: ...,
 * });
 *
 * ```
 */
export async function previewWithdraw(
  options: BaseTransactionOptions<PreviewWithdrawParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.assets],
  });
}
