import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "transfer" function.
 */

type TransferParamsInternal = {
  to: AbiParameterToPrimitiveType<{ type: "address"; name: "to" }>;
  value: AbiParameterToPrimitiveType<{ type: "uint256"; name: "value" }>;
};

export type TransferParams = Prettify<
  | TransferParamsInternal
  | {
      asyncParams: () => Promise<TransferParamsInternal>;
    }
>;
/**
 * Calls the "transfer" function on the contract.
 * @param options - The options for the "transfer" function.
 * @returns A prepared transaction object.
 * @extension ERC20
 * @example
 * ```
 * import { transfer } from "thirdweb/extensions/erc20";
 *
 * const transaction = transfer({
 *  to: ...,
 *  value: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function transfer(options: BaseTransactionOptions<TransferParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xa9059cbb",
      [
        {
          type: "address",
          name: "to",
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
            return [resolvedParams.to, resolvedParams.value] as const;
          }
        : [options.to, options.value],
  });
}
