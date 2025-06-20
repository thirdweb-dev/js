import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "totalSupply" function.
 */
export type TotalSupplyParams = {
  id: AbiParameterToPrimitiveType<{ type: "uint256"; name: "id" }>;
};

export const FN_SELECTOR = "0xbd85b039" as const;
const FN_INPUTS = [
  {
    name: "id",
    type: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
  },
] as const;

/**
 * Checks if the `totalSupply` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `totalSupply` method is supported.
 * @extension ERC1155
 * @example
 * ```ts
 * import { isTotalSupplySupported } from "thirdweb/extensions/erc1155";
 * const supported = isTotalSupplySupported(["0x..."]);
 * ```
 */
export function isTotalSupplySupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "totalSupply" function.
 * @param options - The options for the totalSupply function.
 * @returns The encoded ABI parameters.
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeTotalSupplyParams } from "thirdweb/extensions/erc1155";
 * const result = encodeTotalSupplyParams({
 *  id: ...,
 * });
 * ```
 */
export function encodeTotalSupplyParams(options: TotalSupplyParams) {
  return encodeAbiParameters(FN_INPUTS, [options.id]);
}

/**
 * Encodes the "totalSupply" function into a Hex string with its parameters.
 * @param options - The options for the totalSupply function.
 * @returns The encoded hexadecimal string.
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeTotalSupply } from "thirdweb/extensions/erc1155";
 * const result = encodeTotalSupply({
 *  id: ...,
 * });
 * ```
 */
export function encodeTotalSupply(options: TotalSupplyParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeTotalSupplyParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the totalSupply function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC1155
 * @example
 * ```ts
 * import { decodeTotalSupplyResult } from "thirdweb/extensions/erc1155";
 * const result = decodeTotalSupplyResultResult("...");
 * ```
 */
export function decodeTotalSupplyResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "totalSupply" function on the contract.
 * @param options - The options for the totalSupply function.
 * @returns The parsed result of the function call.
 * @extension ERC1155
 * @example
 * ```ts
 * import { totalSupply } from "thirdweb/extensions/erc1155";
 *
 * const result = await totalSupply({
 *  contract,
 *  id: ...,
 * });
 *
 * ```
 */
export async function totalSupply(
  options: BaseTransactionOptions<TotalSupplyParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.id],
  });
}
