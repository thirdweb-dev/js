import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "previewRedeem" function.
 */
export type PreviewRedeemParams = {
  shares: AbiParameterToPrimitiveType<{
    name: "shares";
    type: "uint256";
    internalType: "uint256";
  }>;
};

export const FN_SELECTOR = "0x4cdad506" as const;
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
 * Checks if the `previewRedeem` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `previewRedeem` method is supported.
 * @extension ERC4626
 * @example
 * ```ts
 * import { isPreviewRedeemSupported } from "thirdweb/extensions/erc4626";
 *
 * const supported = await isPreviewRedeemSupported(contract);
 * ```
 */
export async function isPreviewRedeemSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "previewRedeem" function.
 * @param options - The options for the previewRedeem function.
 * @returns The encoded ABI parameters.
 * @extension ERC4626
 * @example
 * ```ts
 * import { encodePreviewRedeemParams } "thirdweb/extensions/erc4626";
 * const result = encodePreviewRedeemParams({
 *  shares: ...,
 * });
 * ```
 */
export function encodePreviewRedeemParams(options: PreviewRedeemParams) {
  return encodeAbiParameters(FN_INPUTS, [options.shares]);
}

/**
 * Encodes the "previewRedeem" function into a Hex string with its parameters.
 * @param options - The options for the previewRedeem function.
 * @returns The encoded hexadecimal string.
 * @extension ERC4626
 * @example
 * ```ts
 * import { encodePreviewRedeem } "thirdweb/extensions/erc4626";
 * const result = encodePreviewRedeem({
 *  shares: ...,
 * });
 * ```
 */
export function encodePreviewRedeem(options: PreviewRedeemParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodePreviewRedeemParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the previewRedeem function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC4626
 * @example
 * ```ts
 * import { decodePreviewRedeemResult } from "thirdweb/extensions/erc4626";
 * const result = decodePreviewRedeemResult("...");
 * ```
 */
export function decodePreviewRedeemResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "previewRedeem" function on the contract.
 * @param options - The options for the previewRedeem function.
 * @returns The parsed result of the function call.
 * @extension ERC4626
 * @example
 * ```ts
 * import { previewRedeem } from "thirdweb/extensions/erc4626";
 *
 * const result = await previewRedeem({
 *  contract,
 *  shares: ...,
 * });
 *
 * ```
 */
export async function previewRedeem(
  options: BaseTransactionOptions<PreviewRedeemParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.shares],
  });
}
