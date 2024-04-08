import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "exactInputSingle" function.
 */

export type ExactInputSingleParams = {
  params: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "params";
    components: [
      { type: "address"; name: "tokenIn" },
      { type: "address"; name: "tokenOut" },
      { type: "uint24"; name: "fee" },
      { type: "address"; name: "recipient" },
      { type: "uint256"; name: "deadline" },
      { type: "uint256"; name: "amountIn" },
      { type: "uint256"; name: "amountOutMinimum" },
      { type: "uint160"; name: "sqrtPriceLimitX96" },
    ];
  }>;
};

export const FN_SELECTOR = "0x414bf389" as const;
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
        name: "amountIn",
      },
      {
        type: "uint256",
        name: "amountOutMinimum",
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
    name: "amountOut",
  },
] as const;

/**
 * Encodes the parameters for the "exactInputSingle" function.
 * @param options - The options for the exactInputSingle function.
 * @returns The encoded ABI parameters.
 * @extension UNISWAP
 * @example
 * ```ts
 * import { encodeExactInputSingleParams } "thirdweb/extensions/uniswap";
 * const result = encodeExactInputSingleParams({
 *  params: ...,
 * });
 * ```
 */
export function encodeExactInputSingleParams(options: ExactInputSingleParams) {
  return encodeAbiParameters(FN_INPUTS, [options.params]);
}

/**
 * Calls the "exactInputSingle" function on the contract.
 * @param options - The options for the "exactInputSingle" function.
 * @returns A prepared transaction object.
 * @extension UNISWAP
 * @example
 * ```ts
 * import { exactInputSingle } from "thirdweb/extensions/uniswap";
 *
 * const transaction = exactInputSingle({
 *  contract,
 *  params: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function exactInputSingle(
  options: BaseTransactionOptions<
    | ExactInputSingleParams
    | {
        asyncParams: () => Promise<ExactInputSingleParams>;
      }
  >,
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
