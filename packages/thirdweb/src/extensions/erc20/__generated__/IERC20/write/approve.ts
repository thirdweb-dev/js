import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "approve" function.
 */

type ApproveParamsInternal = {
  spender: AbiParameterToPrimitiveType<{ type: "address"; name: "spender" }>;
  value: AbiParameterToPrimitiveType<{ type: "uint256"; name: "value" }>;
};

export type ApproveParams = Prettify<
  | ApproveParamsInternal
  | {
      asyncParams: () => Promise<ApproveParamsInternal>;
    }
>;
/**
 * Calls the "approve" function on the contract.
 * @param options - The options for the "approve" function.
 * @returns A prepared transaction object.
 * @extension ERC20
 * @example
 * ```
 * import { approve } from "thirdweb/extensions/erc20";
 *
 * const transaction = approve({
 *  spender: ...,
 *  value: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function approve(options: BaseTransactionOptions<ApproveParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x095ea7b3",
      [
        {
          type: "address",
          name: "spender",
        },
        {
          type: "uint256",
          name: "value",
        },
      ],
      [
        {
          type: "bool",
        },
      ],
    ],
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.spender, resolvedParams.value] as const;
          }
        : [options.spender, options.value],
  });
}
