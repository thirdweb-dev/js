import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "withdraw" function.
 */
export type WithdrawParams = {
  amount: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "amount";
    type: "uint256";
  }>;
};

/**
 * Calls the "withdraw" function on the contract.
 * @param options - The options for the "withdraw" function.
 * @returns A prepared transaction object.
 * @extension ERC20
 * @example
 * ```
 * import { withdraw } from "thirdweb/extensions/erc20";
 *
 * const transaction = withdraw({
 *  amount: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function withdraw(options: BaseTransactionOptions<WithdrawParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x2e1a7d4d",
      [
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      [],
    ],
    params: [options.amount],
  });
}
