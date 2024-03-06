import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "delegate" function.
 */
export type DelegateParams = {
  delegatee: AbiParameterToPrimitiveType<{
    type: "address";
    name: "delegatee";
  }>;
};

/**
 * Calls the "delegate" function on the contract.
 * @param options - The options for the "delegate" function.
 * @returns A prepared transaction object.
 * @extension ERC20
 * @example
 * ```
 * import { delegate } from "thirdweb/extensions/erc20";
 *
 * const transaction = delegate({
 *  delegatee: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function delegate(options: BaseTransactionOptions<DelegateParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x5c19a95c",
      [
        {
          type: "address",
          name: "delegatee",
        },
      ],
      [],
    ],
    params: [options.delegatee],
  });
}
