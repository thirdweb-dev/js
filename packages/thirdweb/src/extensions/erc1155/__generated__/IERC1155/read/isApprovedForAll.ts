import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "isApprovedForAll" function.
 */
export type IsApprovedForAllParams = {
  owner: AbiParameterToPrimitiveType<{ type: "address"; name: "_owner" }>;
  operator: AbiParameterToPrimitiveType<{ type: "address"; name: "_operator" }>;
};

export const FN_SELECTOR = "0xe985e9c5" as const;
const FN_INPUTS = [
  {
    name: "_owner",
    type: "address",
  },
  {
    name: "_operator",
    type: "address",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "bool",
  },
] as const;

/**
 * Checks if the `isApprovedForAll` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `isApprovedForAll` method is supported.
 * @extension ERC1155
 * @example
 * ```ts
 * import { isIsApprovedForAllSupported } from "thirdweb/extensions/erc1155";
 * const supported = isIsApprovedForAllSupported(["0x..."]);
 * ```
 */
export function isIsApprovedForAllSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "isApprovedForAll" function.
 * @param options - The options for the isApprovedForAll function.
 * @returns The encoded ABI parameters.
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeIsApprovedForAllParams } from "thirdweb/extensions/erc1155";
 * const result = encodeIsApprovedForAllParams({
 *  owner: ...,
 *  operator: ...,
 * });
 * ```
 */
export function encodeIsApprovedForAllParams(options: IsApprovedForAllParams) {
  return encodeAbiParameters(FN_INPUTS, [options.owner, options.operator]);
}

/**
 * Encodes the "isApprovedForAll" function into a Hex string with its parameters.
 * @param options - The options for the isApprovedForAll function.
 * @returns The encoded hexadecimal string.
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeIsApprovedForAll } from "thirdweb/extensions/erc1155";
 * const result = encodeIsApprovedForAll({
 *  owner: ...,
 *  operator: ...,
 * });
 * ```
 */
export function encodeIsApprovedForAll(options: IsApprovedForAllParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeIsApprovedForAllParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the isApprovedForAll function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC1155
 * @example
 * ```ts
 * import { decodeIsApprovedForAllResult } from "thirdweb/extensions/erc1155";
 * const result = decodeIsApprovedForAllResultResult("...");
 * ```
 */
export function decodeIsApprovedForAllResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "isApprovedForAll" function on the contract.
 * @param options - The options for the isApprovedForAll function.
 * @returns The parsed result of the function call.
 * @extension ERC1155
 * @example
 * ```ts
 * import { isApprovedForAll } from "thirdweb/extensions/erc1155";
 *
 * const result = await isApprovedForAll({
 *  contract,
 *  owner: ...,
 *  operator: ...,
 * });
 *
 * ```
 */
export async function isApprovedForAll(
  options: BaseTransactionOptions<IsApprovedForAllParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.owner, options.operator],
  });
}
