import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "exactInput" function.
 */
export type ExactInputParams = {
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
    params: [options.params],
  });
}
