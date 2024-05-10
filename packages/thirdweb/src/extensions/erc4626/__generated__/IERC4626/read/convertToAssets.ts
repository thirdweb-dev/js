import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "convertToAssets" function.
 */
export type ConvertToAssetsParams = {
  shares: AbiParameterToPrimitiveType<{
    name: "shares";
    type: "uint256";
    internalType: "uint256";
  }>;
};

export const FN_SELECTOR = "0x07a2d13a" as const;
const FN_INPUTS = [
  {
    name: "shares",
    type: "uint256",
    internalType: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "assets",
    type: "uint256",
    internalType: "uint256",
  },
] as const;

/**
 * Checks if the `convertToAssets` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `convertToAssets` method is supported.
 * @extension ERC4626
 * @example
 * ```ts
 * import { isConvertToAssetsSupported } from "thirdweb/extensions/erc4626";
 *
 * const supported = await isConvertToAssetsSupported(contract);
 * ```
 */
export async function isConvertToAssetsSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "convertToAssets" function.
 * @param options - The options for the convertToAssets function.
 * @returns The encoded ABI parameters.
 * @extension ERC4626
 * @example
 * ```ts
 * import { encodeConvertToAssetsParams } "thirdweb/extensions/erc4626";
 * const result = encodeConvertToAssetsParams({
 *  shares: ...,
 * });
 * ```
 */
export function encodeConvertToAssetsParams(options: ConvertToAssetsParams) {
  return encodeAbiParameters(FN_INPUTS, [options.shares]);
}

/**
 * Encodes the "convertToAssets" function into a Hex string with its parameters.
 * @param options - The options for the convertToAssets function.
 * @returns The encoded hexadecimal string.
 * @extension ERC4626
 * @example
 * ```ts
 * import { encodeConvertToAssets } "thirdweb/extensions/erc4626";
 * const result = encodeConvertToAssets({
 *  shares: ...,
 * });
 * ```
 */
export function encodeConvertToAssets(options: ConvertToAssetsParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeConvertToAssetsParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the convertToAssets function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC4626
 * @example
 * ```ts
 * import { decodeConvertToAssetsResult } from "thirdweb/extensions/erc4626";
 * const result = decodeConvertToAssetsResult("...");
 * ```
 */
export function decodeConvertToAssetsResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "convertToAssets" function on the contract.
 * @param options - The options for the convertToAssets function.
 * @returns The parsed result of the function call.
 * @extension ERC4626
 * @example
 * ```ts
 * import { convertToAssets } from "thirdweb/extensions/erc4626";
 *
 * const result = await convertToAssets({
 *  contract,
 *  shares: ...,
 * });
 *
 * ```
 */
export async function convertToAssets(
  options: BaseTransactionOptions<ConvertToAssetsParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.shares],
  });
}
