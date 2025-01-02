import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "previewRedeem" function.
 */
export type PreviewRedeemParams = {
  shares: AbiParameterToPrimitiveType<{ type: "uint256"; name: "shares" }>;
};

export const FN_SELECTOR = "0x4cdad506" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "shares",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
    name: "assets",
  },
] as const;

/**
 * Checks if the `previewRedeem` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `previewRedeem` method is supported.
 * @extension ERC4626
 * @example
 * ```ts
 * import { isPreviewRedeemSupported } from "thirdweb/extensions/erc4626";
 * const supported = isPreviewRedeemSupported(["0x..."]);
 * ```
 */
export function isPreviewRedeemSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
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
 * import { encodePreviewRedeemParams } from "thirdweb/extensions/erc4626";
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
 * import { encodePreviewRedeem } from "thirdweb/extensions/erc4626";
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
 * const result = decodePreviewRedeemResultResult("...");
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
