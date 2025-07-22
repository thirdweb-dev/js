import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "positions" function.
 */
export type PositionsParams = {
  owner: AbiParameterToPrimitiveType<{ type: "address"; name: "owner" }>;
  asset: AbiParameterToPrimitiveType<{ type: "address"; name: "asset" }>;
};

export const FN_SELECTOR = "0x4bd21445" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "owner",
  },
  {
    type: "address",
    name: "asset",
  },
] as const;
const FN_OUTPUTS = [
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
] as const;

/**
 * Checks if the `positions` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `positions` method is supported.
 * @extension ASSETS
 * @example
 * ```ts
 * import { isPositionsSupported } from "thirdweb/extensions/assets";
 * const supported = isPositionsSupported(["0x..."]);
 * ```
 */
export function isPositionsSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "positions" function.
 * @param options - The options for the positions function.
 * @returns The encoded ABI parameters.
 * @extension ASSETS
 * @example
 * ```ts
 * import { encodePositionsParams } from "thirdweb/extensions/assets";
 * const result = encodePositionsParams({
 *  owner: ...,
 *  asset: ...,
 * });
 * ```
 */
export function encodePositionsParams(options: PositionsParams) {
  return encodeAbiParameters(FN_INPUTS, [options.owner, options.asset]);
}

/**
 * Encodes the "positions" function into a Hex string with its parameters.
 * @param options - The options for the positions function.
 * @returns The encoded hexadecimal string.
 * @extension ASSETS
 * @example
 * ```ts
 * import { encodePositions } from "thirdweb/extensions/assets";
 * const result = encodePositions({
 *  owner: ...,
 *  asset: ...,
 * });
 * ```
 */
export function encodePositions(options: PositionsParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodePositionsParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the positions function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ASSETS
 * @example
 * ```ts
 * import { decodePositionsResult } from "thirdweb/extensions/assets";
 * const result = decodePositionsResultResult("...");
 * ```
 */
export function decodePositionsResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result);
}

/**
 * Calls the "positions" function on the contract.
 * @param options - The options for the positions function.
 * @returns The parsed result of the function call.
 * @extension ASSETS
 * @example
 * ```ts
 * import { positions } from "thirdweb/extensions/assets";
 *
 * const result = await positions({
 *  contract,
 *  owner: ...,
 *  asset: ...,
 * });
 *
 * ```
 */
export async function positions(
  options: BaseTransactionOptions<PositionsParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.owner, options.asset],
  });
}
