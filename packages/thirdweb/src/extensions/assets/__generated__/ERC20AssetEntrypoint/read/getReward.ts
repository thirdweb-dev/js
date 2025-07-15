import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "getReward" function.
 */
export type GetRewardParams = {
  asset: AbiParameterToPrimitiveType<{ type: "address"; name: "asset" }>;
};

export const FN_SELECTOR = "0xc00007b0" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "asset",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "tuple",
    components: [
      {
        type: "address",
        name: "positionManager",
      },
      {
        type: "uint256",
        name: "tokenId",
      },
      {
        type: "address",
        name: "recipient",
      },
      {
        type: "address",
        name: "referrer",
      },
      {
        type: "uint16",
        name: "referrerBps",
      },
    ],
  },
] as const;

/**
 * Checks if the `getReward` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getReward` method is supported.
 * @extension ASSETS
 * @example
 * ```ts
 * import { isGetRewardSupported } from "thirdweb/extensions/assets";
 * const supported = isGetRewardSupported(["0x..."]);
 * ```
 */
export function isGetRewardSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getReward" function.
 * @param options - The options for the getReward function.
 * @returns The encoded ABI parameters.
 * @extension ASSETS
 * @example
 * ```ts
 * import { encodeGetRewardParams } from "thirdweb/extensions/assets";
 * const result = encodeGetRewardParams({
 *  asset: ...,
 * });
 * ```
 */
export function encodeGetRewardParams(options: GetRewardParams) {
  return encodeAbiParameters(FN_INPUTS, [options.asset]);
}

/**
 * Encodes the "getReward" function into a Hex string with its parameters.
 * @param options - The options for the getReward function.
 * @returns The encoded hexadecimal string.
 * @extension ASSETS
 * @example
 * ```ts
 * import { encodeGetReward } from "thirdweb/extensions/assets";
 * const result = encodeGetReward({
 *  asset: ...,
 * });
 * ```
 */
export function encodeGetReward(options: GetRewardParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetRewardParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getReward function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ASSETS
 * @example
 * ```ts
 * import { decodeGetRewardResult } from "thirdweb/extensions/assets";
 * const result = decodeGetRewardResultResult("...");
 * ```
 */
export function decodeGetRewardResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getReward" function on the contract.
 * @param options - The options for the getReward function.
 * @returns The parsed result of the function call.
 * @extension ASSETS
 * @example
 * ```ts
 * import { getReward } from "thirdweb/extensions/assets";
 *
 * const result = await getReward({
 *  contract,
 *  asset: ...,
 * });
 *
 * ```
 */
export async function getReward(
  options: BaseTransactionOptions<GetRewardParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.asset],
  });
}
