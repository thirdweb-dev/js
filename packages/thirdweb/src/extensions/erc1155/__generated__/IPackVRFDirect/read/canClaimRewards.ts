import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "canClaimRewards" function.
 */
export type CanClaimRewardsParams = {
  opener: AbiParameterToPrimitiveType<{ type: "address"; name: "_opener" }>;
};

export const FN_SELECTOR = "0xa9b47a66" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "_opener",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bool",
  },
] as const;

/**
 * Encodes the parameters for the "canClaimRewards" function.
 * @param options - The options for the canClaimRewards function.
 * @returns The encoded ABI parameters.
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeCanClaimRewardsParams } "thirdweb/extensions/erc1155";
 * const result = encodeCanClaimRewardsParams({
 *  opener: ...,
 * });
 * ```
 */
export function encodeCanClaimRewardsParams(options: CanClaimRewardsParams) {
  return encodeAbiParameters(FN_INPUTS, [options.opener]);
}

/**
 * Decodes the result of the canClaimRewards function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC1155
 * @example
 * ```ts
 * import { decodeCanClaimRewardsResult } from "thirdweb/extensions/erc1155";
 * const result = decodeCanClaimRewardsResult("...");
 * ```
 */
export function decodeCanClaimRewardsResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "canClaimRewards" function on the contract.
 * @param options - The options for the canClaimRewards function.
 * @returns The parsed result of the function call.
 * @extension ERC1155
 * @example
 * ```ts
 * import { canClaimRewards } from "thirdweb/extensions/erc1155";
 *
 * const result = await canClaimRewards({
 *  opener: ...,
 * });
 *
 * ```
 */
export async function canClaimRewards(
  options: BaseTransactionOptions<CanClaimRewardsParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.opener],
  });
}
