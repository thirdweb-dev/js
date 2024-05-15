import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

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
 * Checks if the `canClaimRewards` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `canClaimRewards` method is supported.
 * @extension ERC1155
 * @example
 * ```ts
 * import { isCanClaimRewardsSupported } from "thirdweb/extensions/erc1155";
 *
 * const supported = await isCanClaimRewardsSupported(contract);
 * ```
 */
export async function isCanClaimRewardsSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

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
 * Encodes the "canClaimRewards" function into a Hex string with its parameters.
 * @param options - The options for the canClaimRewards function.
 * @returns The encoded hexadecimal string.
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeCanClaimRewards } "thirdweb/extensions/erc1155";
 * const result = encodeCanClaimRewards({
 *  opener: ...,
 * });
 * ```
 */
export function encodeCanClaimRewards(options: CanClaimRewardsParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeCanClaimRewardsParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
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
 *  contract,
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
