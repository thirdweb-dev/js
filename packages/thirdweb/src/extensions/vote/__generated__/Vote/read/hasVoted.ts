import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "hasVoted" function.
 */
export type HasVotedParams = {
  proposalId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "proposalId";
  }>;
  account: AbiParameterToPrimitiveType<{ type: "address"; name: "account" }>;
};

export const FN_SELECTOR = "0x43859632" as const;
const FN_INPUTS = [
  {
    name: "proposalId",
    type: "uint256",
  },
  {
    name: "account",
    type: "address",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bool",
  },
] as const;

/**
 * Checks if the `hasVoted` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `hasVoted` method is supported.
 * @extension VOTE
 * @example
 * ```ts
 * import { isHasVotedSupported } from "thirdweb/extensions/vote";
 * const supported = isHasVotedSupported(["0x..."]);
 * ```
 */
export function isHasVotedSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "hasVoted" function.
 * @param options - The options for the hasVoted function.
 * @returns The encoded ABI parameters.
 * @extension VOTE
 * @example
 * ```ts
 * import { encodeHasVotedParams } from "thirdweb/extensions/vote";
 * const result = encodeHasVotedParams({
 *  proposalId: ...,
 *  account: ...,
 * });
 * ```
 */
export function encodeHasVotedParams(options: HasVotedParams) {
  return encodeAbiParameters(FN_INPUTS, [options.proposalId, options.account]);
}

/**
 * Encodes the "hasVoted" function into a Hex string with its parameters.
 * @param options - The options for the hasVoted function.
 * @returns The encoded hexadecimal string.
 * @extension VOTE
 * @example
 * ```ts
 * import { encodeHasVoted } from "thirdweb/extensions/vote";
 * const result = encodeHasVoted({
 *  proposalId: ...,
 *  account: ...,
 * });
 * ```
 */
export function encodeHasVoted(options: HasVotedParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeHasVotedParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the hasVoted function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension VOTE
 * @example
 * ```ts
 * import { decodeHasVotedResult } from "thirdweb/extensions/vote";
 * const result = decodeHasVotedResultResult("...");
 * ```
 */
export function decodeHasVotedResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "hasVoted" function on the contract.
 * @param options - The options for the hasVoted function.
 * @returns The parsed result of the function call.
 * @extension VOTE
 * @example
 * ```ts
 * import { hasVoted } from "thirdweb/extensions/vote";
 *
 * const result = await hasVoted({
 *  contract,
 *  proposalId: ...,
 *  account: ...,
 * });
 *
 * ```
 */
export async function hasVoted(
  options: BaseTransactionOptions<HasVotedParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.proposalId, options.account],
  });
}
