import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "delegates" function.
 */
export type DelegatesParams = {
  account: AbiParameterToPrimitiveType<{ type: "address"; name: "account" }>;
};

export const FN_SELECTOR = "0x587cde1e" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "account",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "address",
  },
] as const;

/**
 * Encodes the parameters for the "delegates" function.
 * @param options - The options for the delegates function.
 * @returns The encoded ABI parameters.
 * @extension ERC20
 * @example
 * ```ts
 * import { encodeDelegatesParams } "thirdweb/extensions/erc20";
 * const result = encodeDelegatesParams({
 *  account: ...,
 * });
 * ```
 */
export function encodeDelegatesParams(options: DelegatesParams) {
  return encodeAbiParameters(FN_INPUTS, [options.account]);
}

/**
 * Decodes the result of the delegates function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension ERC20
 * @example
 * ```ts
 * import { decodeDelegatesResult } from "thirdweb/extensions/erc20";
 * const result = decodeDelegatesResult("...");
 * ```
 */
export function decodeDelegatesResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "delegates" function on the contract.
 * @param options - The options for the delegates function.
 * @returns The parsed result of the function call.
 * @extension ERC20
 * @example
 * ```ts
 * import { delegates } from "thirdweb/extensions/erc20";
 *
 * const result = await delegates({
 *  account: ...,
 * });
 *
 * ```
 */
export async function delegates(
  options: BaseTransactionOptions<DelegatesParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.account],
  });
}
