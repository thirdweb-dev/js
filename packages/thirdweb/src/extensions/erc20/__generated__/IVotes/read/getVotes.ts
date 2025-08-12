import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getVotes" function.
 */
export type GetVotesParams = {
  account: AbiParameterToPrimitiveType<{ type: "address"; name: "account" }>;
};

export const FN_SELECTOR = "0x9ab24eb0" as const;
const FN_INPUTS = [
  {
    name: "account",
    type: "address",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Checks if the `getVotes` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getVotes` method is supported.
 * @extension ERC20
 * @example
 * ```ts
 * import { isGetVotesSupported } from "thirdweb/extensions/erc20";
 * const supported = isGetVotesSupported(["0x..."]);
 * ```
 */
export function isGetVotesSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getVotes" function.
 * @param options - The options for the getVotes function.
 * @returns The encoded ABI parameters.
 * @extension ERC20
 * @example
 * ```ts
 * import { encodeGetVotesParams } from "thirdweb/extensions/erc20";
 * const result = encodeGetVotesParams({
 *  account: ...,
 * });
 * ```
 */
export function encodeGetVotesParams(options: GetVotesParams) {
  return encodeAbiParameters(FN_INPUTS, [options.account]);
}

/**
 * Encodes the "getVotes" function into a Hex string with its parameters.
 * @param options - The options for the getVotes function.
 * @returns The encoded hexadecimal string.
 * @extension ERC20
 * @example
 * ```ts
 * import { encodeGetVotes } from "thirdweb/extensions/erc20";
 * const result = encodeGetVotes({
 *  account: ...,
 * });
 * ```
 */
export function encodeGetVotes(options: GetVotesParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetVotesParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getVotes function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC20
 * @example
 * ```ts
 * import { decodeGetVotesResult } from "thirdweb/extensions/erc20";
 * const result = decodeGetVotesResultResult("...");
 * ```
 */
export function decodeGetVotesResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getVotes" function on the contract.
 * @param options - The options for the getVotes function.
 * @returns The parsed result of the function call.
 * @extension ERC20
 * @example
 * ```ts
 * import { getVotes } from "thirdweb/extensions/erc20";
 *
 * const result = await getVotes({
 *  contract,
 *  account: ...,
 * });
 *
 * ```
 */
export async function getVotes(
  options: BaseTransactionOptions<GetVotesParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.account],
  });
}
