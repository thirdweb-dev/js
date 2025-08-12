import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "convertToShares" function.
 */
export type ConvertToSharesParams = {
  assets: AbiParameterToPrimitiveType<{ type: "uint256"; name: "assets" }>;
};

export const FN_SELECTOR = "0xc6e6f592" as const;
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
 * Checks if the `convertToShares` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `convertToShares` method is supported.
 * @extension ERC4626
 * @example
 * ```ts
 * import { isConvertToSharesSupported } from "thirdweb/extensions/erc4626";
 * const supported = isConvertToSharesSupported(["0x..."]);
 * ```
 */
export function isConvertToSharesSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "convertToShares" function.
 * @param options - The options for the convertToShares function.
 * @returns The encoded ABI parameters.
 * @extension ERC4626
 * @example
 * ```ts
 * import { encodeConvertToSharesParams } from "thirdweb/extensions/erc4626";
 * const result = encodeConvertToSharesParams({
 *  assets: ...,
 * });
 * ```
 */
export function encodeConvertToSharesParams(options: ConvertToSharesParams) {
  return encodeAbiParameters(FN_INPUTS, [options.assets]);
}

/**
 * Encodes the "convertToShares" function into a Hex string with its parameters.
 * @param options - The options for the convertToShares function.
 * @returns The encoded hexadecimal string.
 * @extension ERC4626
 * @example
 * ```ts
 * import { encodeConvertToShares } from "thirdweb/extensions/erc4626";
 * const result = encodeConvertToShares({
 *  assets: ...,
 * });
 * ```
 */
export function encodeConvertToShares(options: ConvertToSharesParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeConvertToSharesParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the convertToShares function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC4626
 * @example
 * ```ts
 * import { decodeConvertToSharesResult } from "thirdweb/extensions/erc4626";
 * const result = decodeConvertToSharesResultResult("...");
 * ```
 */
export function decodeConvertToSharesResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "convertToShares" function on the contract.
 * @param options - The options for the convertToShares function.
 * @returns The parsed result of the function call.
 * @extension ERC4626
 * @example
 * ```ts
 * import { convertToShares } from "thirdweb/extensions/erc4626";
 *
 * const result = await convertToShares({
 *  contract,
 *  assets: ...,
 * });
 *
 * ```
 */
export async function convertToShares(
  options: BaseTransactionOptions<ConvertToSharesParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.assets],
  });
}
