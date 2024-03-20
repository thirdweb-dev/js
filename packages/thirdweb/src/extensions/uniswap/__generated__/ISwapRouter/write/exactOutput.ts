import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "exactOutput" function.
 */

type ExactOutputParamsInternal = {
  params: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "params";
    components: [
      { type: "bytes"; name: "path" },
      { type: "address"; name: "recipient" },
      { type: "uint256"; name: "deadline" },
      { type: "uint256"; name: "amountOut" },
      { type: "uint256"; name: "amountInMaximum" },
    ];
  }>;
};

export type ExactOutputParams = Prettify<
  | ExactOutputParamsInternal
  | {
      asyncParams: () => Promise<ExactOutputParamsInternal>;
    }
>;
const METHOD = [
  "0xf28c0498",
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
          name: "amountOut",
        },
        {
          type: "uint256",
          name: "amountInMaximum",
        },
      ],
    },
  ],
  [
    {
      type: "uint256",
      name: "amountIn",
    },
  ],
] as const;

/**
 * Calls the "exactOutput" function on the contract.
 * @param options - The options for the "exactOutput" function.
 * @returns A prepared transaction object.
 * @extension UNISWAP
 * @example
 * ```
 * import { exactOutput } from "thirdweb/extensions/uniswap";
 *
 * const transaction = exactOutput({
 *  params: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function exactOutput(
  options: BaseTransactionOptions<ExactOutputParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: METHOD,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.params] as const;
          }
        : [options.params],
  });
}
