import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { Prettify } from "../../../../../utils/type-utils.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

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
const FN_SELECTOR = "0xc04b8d59" as const;
const FN_INPUTS = [
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
] as const;
const FN_OUTPUTS = [
  {
    type: "uint256",
    name: "amountOut",
  },
] as const;

/**
 * Encodes the parameters for the "exactInput" function.
 * @param options - The options for the exactInput function.
 * @returns The encoded ABI parameters.
 * @extension UNISWAP
 * @example
 * ```
 * import { encodeExactInputParams } "thirdweb/extensions/uniswap";
 * const result = encodeExactInputParams({
 *  params: ...,
 * });
 * ```
 */
export function encodeExactInputParams(options: ExactInputParamsInternal) {
  return encodeAbiParameters(FN_INPUTS, [options.params]);
}

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
