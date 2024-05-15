import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "getPastTotalSupply" function.
 */
export type GetPastTotalSupplyParams = {
  blockNumber: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "blockNumber";
  }>;
};

export const FN_SELECTOR = "0x8e539e8c" as const;
const FN_INPUTS = [
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
 * Checks if the `getPastTotalSupply` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `getPastTotalSupply` method is supported.
 * @extension ERC20
 * @example
 * ```ts
 * import { isGetPastTotalSupplySupported } from "thirdweb/extensions/erc20";
 *
 * const supported = await isGetPastTotalSupplySupported(contract);
 * ```
 */
export async function isGetPastTotalSupplySupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "getPastTotalSupply" function.
 * @param options - The options for the getPastTotalSupply function.
 * @returns The encoded ABI parameters.
 * @extension ERC20
 * @example
 * ```ts
 * import { encodeGetPastTotalSupplyParams } "thirdweb/extensions/erc20";
 * const result = encodeGetPastTotalSupplyParams({
 *  blockNumber: ...,
 * });
 * ```
 */
export function encodeGetPastTotalSupplyParams(
  options: GetPastTotalSupplyParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.blockNumber]);
}

/**
 * Encodes the "getPastTotalSupply" function into a Hex string with its parameters.
 * @param options - The options for the getPastTotalSupply function.
 * @returns The encoded hexadecimal string.
 * @extension ERC20
 * @example
 * ```ts
 * import { encodeGetPastTotalSupply } "thirdweb/extensions/erc20";
 * const result = encodeGetPastTotalSupply({
 *  blockNumber: ...,
 * });
 * ```
 */
export function encodeGetPastTotalSupply(options: GetPastTotalSupplyParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeGetPastTotalSupplyParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the getPastTotalSupply function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC20
 * @example
 * ```ts
 * import { decodeGetPastTotalSupplyResult } from "thirdweb/extensions/erc20";
 * const result = decodeGetPastTotalSupplyResult("...");
 * ```
 */
export function decodeGetPastTotalSupplyResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "getPastTotalSupply" function on the contract.
 * @param options - The options for the getPastTotalSupply function.
 * @returns The parsed result of the function call.
 * @extension ERC20
 * @example
 * ```ts
 * import { getPastTotalSupply } from "thirdweb/extensions/erc20";
 *
 * const result = await getPastTotalSupply({
 *  contract,
 *  blockNumber: ...,
 * });
 *
 * ```
 */
export async function getPastTotalSupply(
  options: BaseTransactionOptions<GetPastTotalSupplyParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.blockNumber],
  });
}
