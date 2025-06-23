import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getStakeInfo" function.
 */
export type GetStakeInfoParams = {
  staker: AbiParameterToPrimitiveType<{ type: "address"; name: "staker" }>;
};

export const FN_SELECTOR = "0xc3453153" as const;
const FN_INPUTS = [
  {
    name: "staker",
    type: "address",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "_tokensStaked",
    type: "uint256[]",
  },
  {
    name: "_rewards",
    type: "uint256",
  },
] as const;

/**
 * Checks if the `getStakeInfo` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `getStakeInfo` method is supported.
 * @extension ERC721
 * @example
 * ```ts
 * import { isGetStakeInfoSupported } from "thirdweb/extensions/erc721";
 * const supported = isGetStakeInfoSupported(["0x..."]);
 * ```
 */
export function isGetStakeInfoSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getStakeInfo" function.
 * @param options - The options for the getStakeInfo function.
 * @returns The encoded ABI parameters.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeGetStakeInfoParams } from "thirdweb/extensions/erc721";
 * const result = encodeGetStakeInfoParams({
 *  staker: ...,
 * });
 * ```
 */
export function encodeGetStakeInfoParams(options: GetStakeInfoParams) {
  return encodeAbiParameters(FN_INPUTS, [options.staker]);
}

/**
 * Encodes the "getStakeInfo" function into a Hex string with its parameters.
 * @param options - The options for the getStakeInfo function.
 * @returns The encoded hexadecimal string.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeGetStakeInfo } from "thirdweb/extensions/erc721";
 * const result = encodeGetStakeInfo({
 *  staker: ...,
 * });
 * ```
 */
export function encodeGetStakeInfo(options: GetStakeInfoParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetStakeInfoParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getStakeInfo function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC721
 * @example
 * ```ts
 * import { decodeGetStakeInfoResult } from "thirdweb/extensions/erc721";
 * const result = decodeGetStakeInfoResultResult("...");
 * ```
 */
export function decodeGetStakeInfoResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result);
}

/**
 * Calls the "getStakeInfo" function on the contract.
 * @param options - The options for the getStakeInfo function.
 * @returns The parsed result of the function call.
 * @extension ERC721
 * @example
 * ```ts
 * import { getStakeInfo } from "thirdweb/extensions/erc721";
 *
 * const result = await getStakeInfo({
 *  contract,
 *  staker: ...,
 * });
 *
 * ```
 */
export async function getStakeInfo(
  options: BaseTransactionOptions<GetStakeInfoParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.staker],
  });
}
