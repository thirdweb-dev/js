import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getApproved" function.
 */
export type GetApprovedParams = {
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "tokenId" }>;
};

export const FN_SELECTOR = "0x081812fc" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "tokenId",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "address",
  },
] as const;

/**
 * Encodes the parameters for the "getApproved" function.
 * @param options - The options for the getApproved function.
 * @returns The encoded ABI parameters.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeGetApprovedParams } "thirdweb/extensions/erc721";
 * const result = encodeGetApprovedParams({
 *  tokenId: ...,
 * });
 * ```
 */
export function encodeGetApprovedParams(options: GetApprovedParams) {
  return encodeAbiParameters(FN_INPUTS, [options.tokenId]);
}

/**
 * Decodes the result of the getApproved function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC721
 * @example
 * ```ts
 * import { decodeGetApprovedResult } from "thirdweb/extensions/erc721";
 * const result = decodeGetApprovedResult("...");
 * ```
 */
export function decodeGetApprovedResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getApproved" function on the contract.
 * @param options - The options for the getApproved function.
 * @returns The parsed result of the function call.
 * @extension ERC721
 * @example
 * ```ts
 * import { getApproved } from "thirdweb/extensions/erc721";
 *
 * const result = await getApproved({
 *  tokenId: ...,
 * });
 *
 * ```
 */
export async function getApproved(
  options: BaseTransactionOptions<GetApprovedParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.tokenId],
  });
}
