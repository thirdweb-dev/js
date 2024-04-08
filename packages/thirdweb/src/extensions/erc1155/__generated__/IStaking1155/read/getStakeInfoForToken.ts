import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getStakeInfoForToken" function.
 */
export type GetStakeInfoForTokenParams = {
  tokenId: AbiParameterToPrimitiveType<{ type: "uint256"; name: "tokenId" }>;
  staker: AbiParameterToPrimitiveType<{ type: "address"; name: "staker" }>;
};

export const FN_SELECTOR = "0x168fb5c5" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "tokenId",
  },
  {
    type: "address",
    name: "staker",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
    name: "_tokensStaked",
  },
  {
    type: "uint256",
    name: "_rewards",
  },
] as const;

/**
 * Encodes the parameters for the "getStakeInfoForToken" function.
 * @param options - The options for the getStakeInfoForToken function.
 * @returns The encoded ABI parameters.
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeGetStakeInfoForTokenParams } "thirdweb/extensions/erc1155";
 * const result = encodeGetStakeInfoForTokenParams({
 *  tokenId: ...,
 *  staker: ...,
 * });
 * ```
 */
export function encodeGetStakeInfoForTokenParams(
  options: GetStakeInfoForTokenParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.tokenId, options.staker]);
}

/**
 * Decodes the result of the getStakeInfoForToken function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC1155
 * @example
 * ```ts
 * import { decodeGetStakeInfoForTokenResult } from "thirdweb/extensions/erc1155";
 * const result = decodeGetStakeInfoForTokenResult("...");
 * ```
 */
export function decodeGetStakeInfoForTokenResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result);
}

/**
 * Calls the "getStakeInfoForToken" function on the contract.
 * @param options - The options for the getStakeInfoForToken function.
 * @returns The parsed result of the function call.
 * @extension ERC1155
 * @example
 * ```ts
 * import { getStakeInfoForToken } from "thirdweb/extensions/erc1155";
 *
 * const result = await getStakeInfoForToken({
 *  tokenId: ...,
 *  staker: ...,
 * });
 *
 * ```
 */
export async function getStakeInfoForToken(
  options: BaseTransactionOptions<GetStakeInfoForTokenParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.tokenId, options.staker],
  });
}
