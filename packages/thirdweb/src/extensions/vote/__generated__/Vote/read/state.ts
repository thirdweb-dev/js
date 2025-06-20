import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "state" function.
 */
export type StateParams = {
  proposalId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "proposalId";
  }>;
};

export const FN_SELECTOR = "0x3e4f49e6" as const;
const FN_INPUTS = [
  {
    name: "proposalId",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint8",
  },
] as const;

/**
 * Checks if the `state` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `state` method is supported.
 * @extension VOTE
 * @example
 * ```ts
 * import { isStateSupported } from "thirdweb/extensions/vote";
 * const supported = isStateSupported(["0x..."]);
 * ```
 */
export function isStateSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "state" function.
 * @param options - The options for the state function.
 * @returns The encoded ABI parameters.
 * @extension VOTE
 * @example
 * ```ts
 * import { encodeStateParams } from "thirdweb/extensions/vote";
 * const result = encodeStateParams({
 *  proposalId: ...,
 * });
 * ```
 */
export function encodeStateParams(options: StateParams) {
  return encodeAbiParameters(FN_INPUTS, [options.proposalId]);
}

/**
 * Encodes the "state" function into a Hex string with its parameters.
 * @param options - The options for the state function.
 * @returns The encoded hexadecimal string.
 * @extension VOTE
 * @example
 * ```ts
 * import { encodeState } from "thirdweb/extensions/vote";
 * const result = encodeState({
 *  proposalId: ...,
 * });
 * ```
 */
export function encodeState(options: StateParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeStateParams(options).slice(2)) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the state function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension VOTE
 * @example
 * ```ts
 * import { decodeStateResult } from "thirdweb/extensions/vote";
 * const result = decodeStateResultResult("...");
 * ```
 */
export function decodeStateResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "state" function on the contract.
 * @param options - The options for the state function.
 * @returns The parsed result of the function call.
 * @extension VOTE
 * @example
 * ```ts
 * import { state } from "thirdweb/extensions/vote";
 *
 * const result = await state({
 *  contract,
 *  proposalId: ...,
 * });
 *
 * ```
 */
export async function state(options: BaseTransactionOptions<StateParams>) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.proposalId],
  });
}
