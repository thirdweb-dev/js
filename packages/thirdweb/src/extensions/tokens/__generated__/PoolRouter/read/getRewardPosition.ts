import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getRewardPosition" function.
 */
export type GetRewardPositionParams = {
  asset: AbiParameterToPrimitiveType<{ type: "address"; name: "asset" }>;
  adapterType: AbiParameterToPrimitiveType<{
    type: "uint8";
    name: "adapterType";
  }>;
};

export const FN_SELECTOR = "0x65798bfb" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "asset",
  },
  {
    type: "uint8",
    name: "adapterType",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "tuple",
    name: "position",
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
 * Checks if the `getRewardPosition` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getRewardPosition` method is supported.
 * @extension TOKENS
 * @example
 * ```ts
 * import { isGetRewardPositionSupported } from "thirdweb/extensions/tokens";
 * const supported = isGetRewardPositionSupported(["0x..."]);
 * ```
 */
export function isGetRewardPositionSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getRewardPosition" function.
 * @param options - The options for the getRewardPosition function.
 * @returns The encoded ABI parameters.
 * @extension TOKENS
 * @example
 * ```ts
 * import { encodeGetRewardPositionParams } from "thirdweb/extensions/tokens";
 * const result = encodeGetRewardPositionParams({
 *  asset: ...,
 *  adapterType: ...,
 * });
 * ```
 */
export function encodeGetRewardPositionParams(
  options: GetRewardPositionParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.asset, options.adapterType]);
}

/**
 * Encodes the "getRewardPosition" function into a Hex string with its parameters.
 * @param options - The options for the getRewardPosition function.
 * @returns The encoded hexadecimal string.
 * @extension TOKENS
 * @example
 * ```ts
 * import { encodeGetRewardPosition } from "thirdweb/extensions/tokens";
 * const result = encodeGetRewardPosition({
 *  asset: ...,
 *  adapterType: ...,
 * });
 * ```
 */
export function encodeGetRewardPosition(options: GetRewardPositionParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetRewardPositionParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getRewardPosition function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension TOKENS
 * @example
 * ```ts
 * import { decodeGetRewardPositionResult } from "thirdweb/extensions/tokens";
 * const result = decodeGetRewardPositionResultResult("...");
 * ```
 */
export function decodeGetRewardPositionResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getRewardPosition" function on the contract.
 * @param options - The options for the getRewardPosition function.
 * @returns The parsed result of the function call.
 * @extension TOKENS
 * @example
 * ```ts
 * import { getRewardPosition } from "thirdweb/extensions/tokens";
 *
 * const result = await getRewardPosition({
 *  contract,
 *  asset: ...,
 *  adapterType: ...,
 * });
 *
 * ```
 */
export async function getRewardPosition(
  options: BaseTransactionOptions<GetRewardPositionParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.asset, options.adapterType],
  });
}
