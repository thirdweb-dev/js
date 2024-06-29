import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "getSaleConfig" function.
 */
export type GetSaleConfigParams = {
  token: AbiParameterToPrimitiveType<{
    name: "_token";
    type: "address";
    internalType: "address";
  }>;
};

const FN_SELECTOR = "0x320eec5a" as const;
const FN_INPUTS = [
  {
    name: "_token",
    type: "address",
    internalType: "address",
  },
] as const;
const FN_OUTPUTS = [
  {
    name: "primarySaleRecipient",
    type: "address",
    internalType: "address",
  },
  {
    name: "platformFeeRecipient",
    type: "address",
    internalType: "address",
  },
  {
    name: "platformFeeBps",
    type: "uint16",
    internalType: "uint16",
  },
] as const;

/**
 * Encodes the parameters for the "getSaleConfig" function.
 * @param options - The options for the getSaleConfig function.
 * @returns The encoded ABI parameters.
 * @extension HOOKS
 * @example
 * ```ts
 * import { encodeGetSaleConfigParams } "thirdweb/extensions/hooks";
 * const result = encodeGetSaleConfigParams({
 *  token: ...,
 * });
 * ```
 */
export function encodeGetSaleConfigParams(options: GetSaleConfigParams) {
  return encodeAbiParameters(FN_INPUTS, [options.token]);
}

/**
 * Decodes the result of the getSaleConfig function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension HOOKS
 * @example
 * ```ts
 * import { decodeGetSaleConfigResult } from "thirdweb/extensions/hooks";
 * const result = decodeGetSaleConfigResult("...");
 * ```
 */
export function decodeGetSaleConfigResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result);
}

/**
 * Calls the "getSaleConfig" function on the contract.
 * @param options - The options for the getSaleConfig function.
 * @returns The parsed result of the function call.
 * @extension HOOKS
 * @example
 * ```ts
 * import { getSaleConfig } from "thirdweb/extensions/hooks";
 *
 * const result = await getSaleConfig({
 *  token: ...,
 * });
 *
 * ```
 */
export async function getSaleConfig(
  options: BaseTransactionOptions<GetSaleConfigParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.token],
  });
}
