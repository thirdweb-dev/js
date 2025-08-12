import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getRewards" function.
 */
export type GetRewardsParams = {
  asset: AbiParameterToPrimitiveType<{ type: "address"; name: "asset" }>;
};

export const FN_SELECTOR = "0x79ee54f7" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "asset",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "tuple[]",
    components: [
      {
        type: "uint256",
        name: "positionId",
      },
      {
        type: "address",
        name: "recipient",
      },
      {
        type: "address",
        name: "developer",
      },
      {
        type: "uint16",
        name: "developerBps",
      },
      {
        type: "address",
        name: "positionManager",
      },
      {
        type: "address",
        name: "rewardLocker",
      },
    ],
  },
] as const;

/**
 * Checks if the `getRewards` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getRewards` method is supported.
 * @extension TOKENS
 * @example
 * ```ts
 * import { isGetRewardsSupported } from "thirdweb/extensions/tokens";
 * const supported = isGetRewardsSupported(["0x..."]);
 * ```
 */
export function isGetRewardsSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getRewards" function.
 * @param options - The options for the getRewards function.
 * @returns The encoded ABI parameters.
 * @extension TOKENS
 * @example
 * ```ts
 * import { encodeGetRewardsParams } from "thirdweb/extensions/tokens";
 * const result = encodeGetRewardsParams({
 *  asset: ...,
 * });
 * ```
 */
export function encodeGetRewardsParams(options: GetRewardsParams) {
  return encodeAbiParameters(FN_INPUTS, [options.asset]);
}

/**
 * Encodes the "getRewards" function into a Hex string with its parameters.
 * @param options - The options for the getRewards function.
 * @returns The encoded hexadecimal string.
 * @extension TOKENS
 * @example
 * ```ts
 * import { encodeGetRewards } from "thirdweb/extensions/tokens";
 * const result = encodeGetRewards({
 *  asset: ...,
 * });
 * ```
 */
export function encodeGetRewards(options: GetRewardsParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetRewardsParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getRewards function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension TOKENS
 * @example
 * ```ts
 * import { decodeGetRewardsResult } from "thirdweb/extensions/tokens";
 * const result = decodeGetRewardsResultResult("...");
 * ```
 */
export function decodeGetRewardsResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getRewards" function on the contract.
 * @param options - The options for the getRewards function.
 * @returns The parsed result of the function call.
 * @extension TOKENS
 * @example
 * ```ts
 * import { getRewards } from "thirdweb/extensions/tokens";
 *
 * const result = await getRewards({
 *  contract,
 *  asset: ...,
 * });
 *
 * ```
 */
export async function getRewards(
  options: BaseTransactionOptions<GetRewardsParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.asset],
  });
}
