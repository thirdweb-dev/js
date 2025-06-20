import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "quorum" function.
 */
export type QuorumParams = {
  blockNumber: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "blockNumber";
  }>;
};

export const FN_SELECTOR = "0xf8ce560a" as const;
const FN_INPUTS = [
  {
    name: "blockNumber",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Checks if the `quorum` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `quorum` method is supported.
 * @extension VOTE
 * @example
 * ```ts
 * import { isQuorumSupported } from "thirdweb/extensions/vote";
 * const supported = isQuorumSupported(["0x..."]);
 * ```
 */
export function isQuorumSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "quorum" function.
 * @param options - The options for the quorum function.
 * @returns The encoded ABI parameters.
 * @extension VOTE
 * @example
 * ```ts
 * import { encodeQuorumParams } from "thirdweb/extensions/vote";
 * const result = encodeQuorumParams({
 *  blockNumber: ...,
 * });
 * ```
 */
export function encodeQuorumParams(options: QuorumParams) {
  return encodeAbiParameters(FN_INPUTS, [options.blockNumber]);
}

/**
 * Encodes the "quorum" function into a Hex string with its parameters.
 * @param options - The options for the quorum function.
 * @returns The encoded hexadecimal string.
 * @extension VOTE
 * @example
 * ```ts
 * import { encodeQuorum } from "thirdweb/extensions/vote";
 * const result = encodeQuorum({
 *  blockNumber: ...,
 * });
 * ```
 */
export function encodeQuorum(options: QuorumParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeQuorumParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the quorum function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension VOTE
 * @example
 * ```ts
 * import { decodeQuorumResult } from "thirdweb/extensions/vote";
 * const result = decodeQuorumResultResult("...");
 * ```
 */
export function decodeQuorumResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "quorum" function on the contract.
 * @param options - The options for the quorum function.
 * @returns The parsed result of the function call.
 * @extension VOTE
 * @example
 * ```ts
 * import { quorum } from "thirdweb/extensions/vote";
 *
 * const result = await quorum({
 *  contract,
 *  blockNumber: ...,
 * });
 *
 * ```
 */
export async function quorum(options: BaseTransactionOptions<QuorumParams>) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.blockNumber],
  });
}
