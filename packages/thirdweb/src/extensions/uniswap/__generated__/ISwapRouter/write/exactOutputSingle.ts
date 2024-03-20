import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { Prettify } from "../../../../../utils/type-utils.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "exactOutputSingle" function.
 */

type ExactOutputSingleParamsInternal = {
  params: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "params";
    components: [
      { type: "address"; name: "tokenIn" },
      { type: "address"; name: "tokenOut" },
      { type: "uint24"; name: "fee" },
      { type: "address"; name: "recipient" },
      { type: "uint256"; name: "deadline" },
      { type: "uint256"; name: "amountOut" },
      { type: "uint256"; name: "amountInMaximum" },
      { type: "uint160"; name: "sqrtPriceLimitX96" },
    ];
  }>;
};

export type ExactOutputSingleParams = Prettify<
  | ExactOutputSingleParamsInternal
  | {
      asyncParams: () => Promise<ExactOutputSingleParamsInternal>;
    }
>;
const FN_SELECTOR = "0xdb3e2198" as const;
const FN_INPUTS = [
  {
    type: "tuple",
    name: "params",
    components: [
      {
        type: "address",
        name: "tokenIn",
      },
      {
        type: "address",
        name: "tokenOut",
      },
      {
        type: "uint24",
        name: "fee",
      },
      {
        type: "address",
        name: "recipient",
      },
      {
        type: "uint256",
        name: "deadline",
      },
      {
        type: "uint256",
        name: "amountOut",
      },
      {
        type: "uint256",
        name: "amountInMaximum",
      },
      {
        type: "uint160",
        name: "sqrtPriceLimitX96",
      },
    ],
  },
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
    name: "amountIn",
  },
] as const;

/**
 * Encodes the parameters for the "exactOutputSingle" function.
 * @param options - The options for the exactOutputSingle function.
 * @returns The encoded ABI parameters.
 * @extension UNISWAP
 * @example
 * ```
 * import { encodeExactOutputSingleParams } "thirdweb/extensions/uniswap";
 * const result = encodeExactOutputSingleParams({
 *  params: ...,
 * });
 * ```
 */
export function encodeExactOutputSingleParams(
  options: ExactOutputSingleParamsInternal,
) {
  return encodeAbiParameters(FN_INPUTS, [options.params]);
}

/**
 * Calls the "exactOutputSingle" function on the contract.
 * @param options - The options for the "exactOutputSingle" function.
 * @returns A prepared transaction object.
 * @extension UNISWAP
 * @example
 * ```
 * import { exactOutputSingle } from "thirdweb/extensions/uniswap";
 *
 * const transaction = exactOutputSingle({
 *  params: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function exactOutputSingle(
  options: BaseTransactionOptions<ExactOutputSingleParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.params] as const;
          }
        : [options.params],
  });
}
