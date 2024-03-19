import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "exactInputSingle" function.
 */

type ExactInputSingleParamsInternal = {
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

export type ExactInputSingleParams = Prettify<
  | ExactInputSingleParamsInternal
  | {
      asyncParams: () => Promise<ExactInputSingleParamsInternal>;
    }
>;
/**
 * Calls the "exactInputSingle" function on the contract.
 * @param options - The options for the "exactInputSingle" function.
 * @returns A prepared transaction object.
 * @extension UNISWAP
 * @example
 * ```
 * import { exactInputSingle } from "thirdweb/extensions/uniswap";
 *
 * const transaction = exactInputSingle({
 *  params: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function exactInputSingle(
  options: BaseTransactionOptions<ExactInputSingleParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x414bf389",
      [
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
      ],
      [
        {
          type: "uint256",
          name: "amountOut",
        },
      ],
    ],
    params: async () => {
      if ("asyncParams" in options) {
        const resolvedParams = await options.asyncParams();
        return [resolvedParams.params] as const;
      }

      return [options.params] as const;
    },
  });
}
