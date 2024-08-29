import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "getRoyaltyInfoForToken" function.
 */
export type GetRoyaltyInfoForTokenParams = {
  tokenId: AbiParameterToPrimitiveType<{
    name: "_tokenId";
    type: "uint256";
    internalType: "uint256";
  }>;
};

export const FN_SELECTOR = "0x4cc157df" as const;
const FN_INPUTS = [
  {
    name: "_tokenId",
    type: "uint256",
    internalType: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "",
    type: "address",
    internalType: "address",
  },
  {
    name: "",
    type: "uint16",
    internalType: "uint16",
  },
] as const;

/**
 * Checks if the `getRoyaltyInfoForToken` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getRoyaltyInfoForToken` method is supported.
 * @extension MODULAR
 * @example
 * ```ts
 * import { isGetRoyaltyInfoForTokenSupported } from "thirdweb/extensions/modular";
 *
 * const supported = isGetRoyaltyInfoForTokenSupported(["0x..."]);
 * ```
 */
export function isGetRoyaltyInfoForTokenSupported(
  availableSelectors: string[],
) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getRoyaltyInfoForToken" function.
 * @param options - The options for the getRoyaltyInfoForToken function.
 * @returns The encoded ABI parameters.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeGetRoyaltyInfoForTokenParams } "thirdweb/extensions/modular";
 * const result = encodeGetRoyaltyInfoForTokenParams({
 *  tokenId: ...,
 * });
 * ```
 */
export function encodeGetRoyaltyInfoForTokenParams(
  options: GetRoyaltyInfoForTokenParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.tokenId]);
}

/**
 * Encodes the "getRoyaltyInfoForToken" function into a Hex string with its parameters.
 * @param options - The options for the getRoyaltyInfoForToken function.
 * @returns The encoded hexadecimal string.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeGetRoyaltyInfoForToken } "thirdweb/extensions/modular";
 * const result = encodeGetRoyaltyInfoForToken({
 *  tokenId: ...,
 * });
 * ```
 */
export function encodeGetRoyaltyInfoForToken(
  options: GetRoyaltyInfoForTokenParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetRoyaltyInfoForTokenParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getRoyaltyInfoForToken function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension MODULAR
 * @example
 * ```ts
 * import { decodeGetRoyaltyInfoForTokenResult } from "thirdweb/extensions/modular";
 * const result = decodeGetRoyaltyInfoForTokenResult("...");
 * ```
 */
export function decodeGetRoyaltyInfoForTokenResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result);
}

/**
 * Calls the "getRoyaltyInfoForToken" function on the contract.
 * @param options - The options for the getRoyaltyInfoForToken function.
 * @returns The parsed result of the function call.
 * @extension MODULAR
 * @example
 * ```ts
 * import { getRoyaltyInfoForToken } from "thirdweb/extensions/modular";
 *
 * const result = await getRoyaltyInfoForToken({
 *  contract,
 *  tokenId: ...,
 * });
 *
 * ```
 */
export async function getRoyaltyInfoForToken(
  options: BaseTransactionOptions<GetRoyaltyInfoForTokenParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.tokenId],
  });
}
