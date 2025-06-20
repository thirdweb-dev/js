import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
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
    name: "_opener",
    type: "address",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bool",
  },
] as const;

/**
 * Checks if the `canClaimRewards` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `canClaimRewards` method is supported.
 * @extension ERC1155
 * @example
 * ```ts
 * import { isCanClaimRewardsSupported } from "thirdweb/extensions/erc1155";
 * const supported = isCanClaimRewardsSupported(["0x..."]);
 * ```
 */
export function isCanClaimRewardsSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
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
 * import { encodeCanClaimRewardsParams } from "thirdweb/extensions/erc1155";
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
 * import { encodeCanClaimRewards } from "thirdweb/extensions/erc1155";
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
 * const result = decodeCanClaimRewardsResultResult("...");
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
