import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "royaltyInfo" function.
 */
export type RoyaltyInfoParams = {
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "tokenId" }>;
  salePrice: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "salePrice";
  }>;
};

export const FN_SELECTOR = "0x2a55205a" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "tokenId",
  },
  {
    type: "uint256",
    name: "salePrice",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "address",
    name: "receiver",
  },
  {
    type: "uint256",
    name: "royaltyAmount",
  },
] as const;

/**
 * Checks if the `royaltyInfo` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `royaltyInfo` method is supported.
 * @extension COMMON
 * @example
 * ```ts
 * import { isRoyaltyInfoSupported } from "thirdweb/extensions/common";
 *
 * const supported = await isRoyaltyInfoSupported(contract);
 * ```
 */
export async function isRoyaltyInfoSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "royaltyInfo" function.
 * @param options - The options for the royaltyInfo function.
 * @returns The encoded ABI parameters.
 * @extension COMMON
 * @example
 * ```ts
 * import { encodeRoyaltyInfoParams } "thirdweb/extensions/common";
 * const result = encodeRoyaltyInfoParams({
 *  tokenId: ...,
 *  salePrice: ...,
 * });
 * ```
 */
export function encodeRoyaltyInfoParams(options: RoyaltyInfoParams) {
  return encodeAbiParameters(FN_INPUTS, [options.tokenId, options.salePrice]);
}

/**
 * Encodes the "royaltyInfo" function into a Hex string with its parameters.
 * @param options - The options for the royaltyInfo function.
 * @returns The encoded hexadecimal string.
 * @extension COMMON
 * @example
 * ```ts
 * import { encodeRoyaltyInfo } "thirdweb/extensions/common";
 * const result = encodeRoyaltyInfo({
 *  tokenId: ...,
 *  salePrice: ...,
 * });
 * ```
 */
export function encodeRoyaltyInfo(options: RoyaltyInfoParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeRoyaltyInfoParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the royaltyInfo function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension COMMON
 * @example
 * ```ts
 * import { decodeRoyaltyInfoResult } from "thirdweb/extensions/common";
 * const result = decodeRoyaltyInfoResult("...");
 * ```
 */
export function decodeRoyaltyInfoResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result);
}

/**
 * Calls the "royaltyInfo" function on the contract.
 * @param options - The options for the royaltyInfo function.
 * @returns The parsed result of the function call.
 * @extension COMMON
 * @example
 * ```ts
 * import { royaltyInfo } from "thirdweb/extensions/common";
 *
 * const result = await royaltyInfo({
 *  contract,
 *  tokenId: ...,
 *  salePrice: ...,
 * });
 *
 * ```
 */
export async function royaltyInfo(
  options: BaseTransactionOptions<RoyaltyInfoParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.tokenId, options.salePrice],
  });
}
