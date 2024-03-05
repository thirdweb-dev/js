import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "stake" function.
 */
export type StakeParams = {
  amount: AbiParameterToPrimitiveType<{ type: "uint256"; name: "amount" }>;
};

/**
 * Calls the "stake" function on the contract.
 * @param options - The options for the "stake" function.
 * @returns A prepared transaction object.
 * @extension ERC20
 * @example
 * ```
 * import { stake } from "thirdweb/extensions/erc20";
 *
 * const transaction = stake({
 *  amount: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function stake(options: BaseTransactionOptions<StakeParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xa694fc3a",
      [
        {
          type: "uint256",
          name: "amount",
        },
      ],
      [],
    ],
    params: [options.amount],
  });
}
