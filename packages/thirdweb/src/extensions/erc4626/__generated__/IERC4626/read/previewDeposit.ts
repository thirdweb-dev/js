import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "previewDeposit" function.
 */
export type PreviewDepositParams = {
  assets: AbiParameterToPrimitiveType<{ type: "uint256"; name: "assets" }>;
};

export const FN_SELECTOR = "0xef8b30f7" as const;
const FN_INPUTS = [
  {
    name: "assets",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "shares",
    type: "uint256",
  },
] as const;

/**
 * Checks if the `previewDeposit` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `previewDeposit` method is supported.
 * @extension ERC4626
 * @example
 * ```ts
 * import { isPreviewDepositSupported } from "thirdweb/extensions/erc4626";
 * const supported = isPreviewDepositSupported(["0x..."]);
 * ```
 */
export function isPreviewDepositSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "previewDeposit" function.
 * @param options - The options for the previewDeposit function.
 * @returns The encoded ABI parameters.
 * @extension ERC4626
 * @example
 * ```ts
 * import { encodePreviewDepositParams } from "thirdweb/extensions/erc4626";
 * const result = encodePreviewDepositParams({
 *  assets: ...,
 * });
 * ```
 */
export function encodePreviewDepositParams(options: PreviewDepositParams) {
  return encodeAbiParameters(FN_INPUTS, [options.assets]);
}

/**
 * Encodes the "previewDeposit" function into a Hex string with its parameters.
 * @param options - The options for the previewDeposit function.
 * @returns The encoded hexadecimal string.
 * @extension ERC4626
 * @example
 * ```ts
 * import { encodePreviewDeposit } from "thirdweb/extensions/erc4626";
 * const result = encodePreviewDeposit({
 *  assets: ...,
 * });
 * ```
 */
export function encodePreviewDeposit(options: PreviewDepositParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodePreviewDepositParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the previewDeposit function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC4626
 * @example
 * ```ts
 * import { decodePreviewDepositResult } from "thirdweb/extensions/erc4626";
 * const result = decodePreviewDepositResultResult("...");
 * ```
 */
export function decodePreviewDepositResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "previewDeposit" function on the contract.
 * @param options - The options for the previewDeposit function.
 * @returns The parsed result of the function call.
 * @extension ERC4626
 * @example
 * ```ts
 * import { previewDeposit } from "thirdweb/extensions/erc4626";
 *
 * const result = await previewDeposit({
 *  contract,
 *  assets: ...,
 * });
 *
 * ```
 */
export async function previewDeposit(
  options: BaseTransactionOptions<PreviewDepositParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.assets],
  });
}
