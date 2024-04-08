import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getMetadataUri" function.
 */
export type GetMetadataUriParams = {
  chainId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_chainId" }>;
  deployment: AbiParameterToPrimitiveType<{
    type: "address";
    name: "_deployment";
  }>;
};

export const FN_SELECTOR = "0xf4c2012d" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "_chainId",
  },
  {
    type: "address",
    name: "_deployment",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "string",
    name: "metadataUri",
  },
] as const;

/**
 * Encodes the parameters for the "getMetadataUri" function.
 * @param options - The options for the getMetadataUri function.
 * @returns The encoded ABI parameters.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { encodeGetMetadataUriParams } "thirdweb/extensions/thirdweb";
 * const result = encodeGetMetadataUriParams({
 *  chainId: ...,
 *  deployment: ...,
 * });
 * ```
 */
export function encodeGetMetadataUriParams(options: GetMetadataUriParams) {
  return encodeAbiParameters(FN_INPUTS, [options.chainId, options.deployment]);
}

/**
 * Decodes the result of the getMetadataUri function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { decodeGetMetadataUriResult } from "thirdweb/extensions/thirdweb";
 * const result = decodeGetMetadataUriResult("...");
 * ```
 */
export function decodeGetMetadataUriResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getMetadataUri" function on the contract.
 * @param options - The options for the getMetadataUri function.
 * @returns The parsed result of the function call.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { getMetadataUri } from "thirdweb/extensions/thirdweb";
 *
 * const result = await getMetadataUri({
 *  chainId: ...,
 *  deployment: ...,
 * });
 *
 * ```
 */
export async function getMetadataUri(
  options: BaseTransactionOptions<GetMetadataUriParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.chainId, options.deployment],
  });
}
