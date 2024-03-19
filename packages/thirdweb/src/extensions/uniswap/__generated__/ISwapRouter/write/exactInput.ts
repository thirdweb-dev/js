import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "exactInput" function.
 */

type ExactInputParamsInternal = {
  params: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "params";
    components: [
      { type: "bytes"; name: "path" },
      { type: "address"; name: "recipient" },
      { type: "uint256"; name: "deadline" },
      { type: "uint256"; name: "amountIn" },
      { type: "uint256"; name: "amountOutMinimum" },
    ];
  }>;
};

export type ExactInputParams = Prettify<
  | ExactInputParamsInternal
  | {
      asyncParams: () => Promise<ExactInputParamsInternal>;
    }
>;
/**
 * Calls the "exactInput" function on the contract.
 * @param options - The options for the "exactInput" function.
 * @returns A prepared transaction object.
 * @extension UNISWAP
 * @example
 * ```
 * import { exactInput } from "thirdweb/extensions/uniswap";
 *
 * const transaction = exactInput({
 *  params: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function exactInput(options: BaseTransactionOptions<ExactInputParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xc04b8d59",
      [
        {
          type: "tuple",
          name: "params",
          components: [
            {
              type: "bytes",
              name: "path",
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
