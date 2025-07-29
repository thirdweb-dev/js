import type { AbiParameterToPrimitiveType } from "abitype";
import { decodeAbiParameters } from "viem";
import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";
import type { Hex } from "../../../../../utils/encoding/hex.js";

/**
 * Represents the parameters for the "calculateFee" function.
 */
export type CalculateFeeParams = {
  payer: AbiParameterToPrimitiveType<{ type: "address"; name: "payer" }>;
  action: AbiParameterToPrimitiveType<{ type: "bytes4"; name: "action" }>;
  amount: AbiParameterToPrimitiveType<{ type: "uint256"; name: "amount" }>;
  maxFeeAmount: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "maxFeeAmount";
  }>;
};

export const FN_SELECTOR = "0x69588801" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "payer",
  },
  {
    type: "bytes4",
    name: "action",
  },
  {
    type: "uint256",
    name: "amount",
  },
  {
    type: "uint256",
    name: "maxFeeAmount",
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "address",
    name: "recipient",
  },
  {
    type: "uint256",
    name: "feeAmount",
  },
] as const;

/**
 * Checks if the `calculateFee` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `calculateFee` method is supported.
 * @extension TOKENS
 * @example
 * ```ts
 * import { isCalculateFeeSupported } from "thirdweb/extensions/tokens";
 * const supported = isCalculateFeeSupported(["0x..."]);
 * ```
 */
export function isCalculateFeeSupported(availableSelectors: string[]) {
  return detectMethod({
    availableSelectors,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "calculateFee" function.
 * @param options - The options for the calculateFee function.
 * @returns The encoded ABI parameters.
 * @extension TOKENS
 * @example
 * ```ts
 * import { encodeCalculateFeeParams } from "thirdweb/extensions/tokens";
 * const result = encodeCalculateFeeParams({
 *  payer: ...,
 *  action: ...,
 *  amount: ...,
 *  maxFeeAmount: ...,
 * });
 * ```
 */
export function encodeCalculateFeeParams(options: CalculateFeeParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.payer,
    options.action,
    options.amount,
    options.maxFeeAmount,
  ]);
}

/**
 * Encodes the "calculateFee" function into a Hex string with its parameters.
 * @param options - The options for the calculateFee function.
 * @returns The encoded hexadecimal string.
 * @extension TOKENS
 * @example
 * ```ts
 * import { encodeCalculateFee } from "thirdweb/extensions/tokens";
 * const result = encodeCalculateFee({
 *  payer: ...,
 *  action: ...,
 *  amount: ...,
 *  maxFeeAmount: ...,
 * });
 * ```
 */
export function encodeCalculateFee(options: CalculateFeeParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeCalculateFeeParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Decodes the result of the calculateFee function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension TOKENS
 * @example
 * ```ts
 * import { decodeCalculateFeeResult } from "thirdweb/extensions/tokens";
 * const result = decodeCalculateFeeResultResult("...");
 * ```
 */
export function decodeCalculateFeeResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result);
}

/**
 * Calls the "calculateFee" function on the contract.
 * @param options - The options for the calculateFee function.
 * @returns The parsed result of the function call.
 * @extension TOKENS
 * @example
 * ```ts
 * import { calculateFee } from "thirdweb/extensions/tokens";
 *
 * const result = await calculateFee({
 *  contract,
 *  payer: ...,
 *  action: ...,
 *  amount: ...,
 *  maxFeeAmount: ...,
 * });
 *
 * ```
 */
export async function calculateFee(
  options: BaseTransactionOptions<CalculateFeeParams>,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [
      options.payer,
      options.action,
      options.amount,
      options.maxFeeAmount,
    ],
  });
}
