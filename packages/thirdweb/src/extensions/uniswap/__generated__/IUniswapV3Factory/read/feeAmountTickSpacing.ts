import type { AbiParameterToPrimitiveType } from "abitype";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "feeAmountTickSpacing" function.
 */
export type FeeAmountTickSpacingParams = {
  fee: AbiParameterToPrimitiveType<{ type: "uint24"; name: "fee" }>;
};

export const FN_SELECTOR = "0x22afcccb" as const;
const FN_INPUTS = [
  {
    type: "uint24",
    name: "fee",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "int24",
  },
] as const;

/**
 * Checks if the `feeAmountTickSpacing` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `feeAmountTickSpacing` method is supported.
 * @extension UNISWAP
 * @example
 * ```ts
 * import { isFeeAmountTickSpacingSupported } from "thirdweb/extensions/uniswap";
 *
 * const supported = await isFeeAmountTickSpacingSupported(contract);
 * ```
 */
export async function isFeeAmountTickSpacingSupported(
  contract: ThirdwebContract<any>,
) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "feeAmountTickSpacing" function.
 * @param options - The options for the feeAmountTickSpacing function.
 * @returns The encoded ABI parameters.
 * @extension UNISWAP
 * @example
 * ```ts
 * import { encodeFeeAmountTickSpacingParams } "thirdweb/extensions/uniswap";
 * const result = encodeFeeAmountTickSpacingParams({
 *  fee: ...,
 * });
 * ```
 */
export function encodeFeeAmountTickSpacingParams(
  options: FeeAmountTickSpacingParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.fee]);
}

/**
 * Encodes the "feeAmountTickSpacing" function into a Hex string with its parameters.
 * @param options - The options for the feeAmountTickSpacing function.
 * @returns The encoded hexadecimal string.
 * @extension UNISWAP
 * @example
 * ```ts
 * import { encodeFeeAmountTickSpacing } "thirdweb/extensions/uniswap";
 * const result = encodeFeeAmountTickSpacing({
 *  fee: ...,
 * });
 * ```
 */
export function encodeFeeAmountTickSpacing(
  options: FeeAmountTickSpacingParams,
) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeFeeAmountTickSpacingParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the feeAmountTickSpacing function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension UNISWAP
 * @example
 * ```ts
 * import { decodeFeeAmountTickSpacingResult } from "thirdweb/extensions/uniswap";
 * const result = decodeFeeAmountTickSpacingResult("...");
 * ```
 */
export function decodeFeeAmountTickSpacingResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "feeAmountTickSpacing" function on the contract.
 * @param options - The options for the feeAmountTickSpacing function.
 * @returns The parsed result of the function call.
 * @extension UNISWAP
 * @example
 * ```ts
 * import { feeAmountTickSpacing } from "thirdweb/extensions/uniswap";
 *
 * const result = await feeAmountTickSpacing({
 *  contract,
 *  fee: ...,
 * });
 *
 * ```
 */
export async function feeAmountTickSpacing(
  options: BaseTransactionOptions<FeeAmountTickSpacingParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [options.fee],
  });
}
