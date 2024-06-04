import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "totalSupply" function.
 */
export type TotalSupplyParams = {
  tokenId: AbiParameterToPrimitiveType<{
    name: "tokenId";
    type: "uint256";
    internalType: "uint256";
  }>;
};

export const FN_SELECTOR = "0xbd85b039" as const;
const FN_INPUTS = [
  {
    name: "tokenId",
    type: "uint256",
    internalType: "uint256",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "",
    type: "uint256",
    internalType: "uint256",
  },
] as const;

/**
 * Checks if the `totalSupply` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `totalSupply` method is supported.
 * @extension MODULAR
 * @example
 * ```ts
 * import { isTotalSupplySupported } from "thirdweb/extensions/modular";
 *
 * const supported = await isTotalSupplySupported(contract);
 * ```
 */
export async function isTotalSupplySupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "totalSupply" function.
 * @param options - The options for the totalSupply function.
 * @returns The encoded ABI parameters.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeTotalSupplyParams } "thirdweb/extensions/modular";
 * const result = encodeTotalSupplyParams({
 *  tokenId: ...,
 * });
 * ```
 */
export function encodeTotalSupplyParams(options: TotalSupplyParams) {
  return encodeAbiParameters(FN_INPUTS, [options.tokenId]);
}

/**
 * Encodes the "totalSupply" function into a Hex string with its parameters.
 * @param options - The options for the totalSupply function.
 * @returns The encoded hexadecimal string.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeTotalSupply } "thirdweb/extensions/modular";
 * const result = encodeTotalSupply({
 *  tokenId: ...,
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
 * @extension MODULAR
 * @example
 * ```ts
 * import { decodeTotalSupplyResult } from "thirdweb/extensions/modular";
 * const result = decodeTotalSupplyResult("...");
 * ```
 */
export function decodeTotalSupplyResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "totalSupply" function on the contract.
 * @param options - The options for the totalSupply function.
 * @returns The parsed result of the function call.
 * @extension MODULAR
 * @example
 * ```ts
 * import { totalSupply } from "thirdweb/extensions/modular";
 *
 * const result = await totalSupply({
 *  contract,
 *  tokenId: ...,
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
    params: [options.tokenId],
  });
}
