import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getVotesWithParams" function.
 */
export type GetVotesWithParamsParams = {
  account: AbiParameterToPrimitiveType<{ type: "address"; name: "account" }>;
  blockNumber: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "blockNumber";
  }>;
  params: AbiParameterToPrimitiveType<{ type: "bytes"; name: "params" }>;
};

export const FN_SELECTOR = "0x9a802a6d" as const;
const FN_INPUTS = [
  {
    name: "account",
    type: "address",
  },
  {
    name: "blockNumber",
    type: "uint256",
  },
  {
    name: "params",
    type: "bytes",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Checks if the `getVotesWithParams` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getVotesWithParams` method is supported.
 * @extension VOTE
 * @example
 * ```ts
 * import { isGetVotesWithParamsSupported } from "thirdweb/extensions/vote";
 * const supported = isGetVotesWithParamsSupported(["0x..."]);
 * ```
 */
export function isGetVotesWithParamsSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getVotesWithParams" function.
 * @param options - The options for the getVotesWithParams function.
 * @returns The encoded ABI parameters.
 * @extension VOTE
 * @example
 * ```ts
 * import { encodeGetVotesWithParamsParams } from "thirdweb/extensions/vote";
 * const result = encodeGetVotesWithParamsParams({
 *  account: ...,
 *  blockNumber: ...,
 *  params: ...,
 * });
 * ```
 */
export function encodeGetVotesWithParamsParams(
  options: GetVotesWithParamsParams,
) {
  return encodeAbiParameters(FN_INPUTS, [
    options.account,
    options.blockNumber,
    options.params,
  ]);
}

/**
 * Encodes the "getVotesWithParams" function into a Hex string with its parameters.
 * @param options - The options for the getVotesWithParams function.
 * @returns The encoded hexadecimal string.
 * @extension VOTE
 * @example
 * ```ts
 * import { encodeGetVotesWithParams } from "thirdweb/extensions/vote";
 * const result = encodeGetVotesWithParams({
 *  account: ...,
 *  blockNumber: ...,
 *  params: ...,
 * });
 * ```
 */
export function encodeGetVotesWithParams(options: GetVotesWithParamsParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetVotesWithParamsParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getVotesWithParams function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension VOTE
 * @example
 * ```ts
 * import { decodeGetVotesWithParamsResult } from "thirdweb/extensions/vote";
 * const result = decodeGetVotesWithParamsResultResult("...");
 * ```
 */
export function decodeGetVotesWithParamsResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getVotesWithParams" function on the contract.
 * @param options - The options for the getVotesWithParams function.
 * @returns The parsed result of the function call.
 * @extension VOTE
 * @example
 * ```ts
 * import { getVotesWithParams } from "thirdweb/extensions/vote";
 *
 * const result = await getVotesWithParams({
 *  contract,
 *  account: ...,
 *  blockNumber: ...,
 *  params: ...,
 * });
 *
 * ```
 */
export async function getVotesWithParams(
  options: BaseTransactionOptions<GetVotesWithParamsParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.account, options.blockNumber, options.params],
  });
}
