import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "getPastVotes" function.
 */
export type GetPastVotesParams = {
  account: AbiParameterToPrimitiveType<{ type: "address"; name: "account" }>;
  blockNumber: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "blockNumber";
  }>;
};

export const FN_SELECTOR = "0x3a46b1a8" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "account",
  },
  {
    type: "uint256",
    name: "blockNumber",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Checks if the `getPastVotes` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `getPastVotes` method is supported.
 * @extension ERC20
 * @example
 * ```ts
 * import { isGetPastVotesSupported } from "thirdweb/extensions/erc20";
 *
 * const supported = await isGetPastVotesSupported(contract);
 * ```
 */
export async function isGetPastVotesSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getPastVotes" function.
 * @param options - The options for the getPastVotes function.
 * @returns The encoded ABI parameters.
 * @extension ERC20
 * @example
 * ```ts
 * import { encodeGetPastVotesParams } "thirdweb/extensions/erc20";
 * const result = encodeGetPastVotesParams({
 *  account: ...,
 *  blockNumber: ...,
 * });
 * ```
 */
export function encodeGetPastVotesParams(options: GetPastVotesParams) {
  return encodeAbiParameters(FN_INPUTS, [options.account, options.blockNumber]);
}

/**
 * Encodes the "getPastVotes" function into a Hex string with its parameters.
 * @param options - The options for the getPastVotes function.
 * @returns The encoded hexadecimal string.
 * @extension ERC20
 * @example
 * ```ts
 * import { encodeGetPastVotes } "thirdweb/extensions/erc20";
 * const result = encodeGetPastVotes({
 *  account: ...,
 *  blockNumber: ...,
 * });
 * ```
 */
export function encodeGetPastVotes(options: GetPastVotesParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetPastVotesParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getPastVotes function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC20
 * @example
 * ```ts
 * import { decodeGetPastVotesResult } from "thirdweb/extensions/erc20";
 * const result = decodeGetPastVotesResult("...");
 * ```
 */
export function decodeGetPastVotesResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getPastVotes" function on the contract.
 * @param options - The options for the getPastVotes function.
 * @returns The parsed result of the function call.
 * @extension ERC20
 * @example
 * ```ts
 * import { getPastVotes } from "thirdweb/extensions/erc20";
 *
 * const result = await getPastVotes({
 *  contract,
 *  account: ...,
 *  blockNumber: ...,
 * });
 *
 * ```
 */
export async function getPastVotes(
  options: BaseTransactionOptions<GetPastVotesParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.account, options.blockNumber],
  });
}
