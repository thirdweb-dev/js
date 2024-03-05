import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "withdrawStake" function.
 */
export type WithdrawStakeParams = {
  withdrawAddress: AbiParameterToPrimitiveType<{
    type: "address";
    name: "withdrawAddress";
  }>;
};

/**
 * Calls the "withdrawStake" function on the contract.
 * @param options - The options for the "withdrawStake" function.
 * @returns A prepared transaction object.
 * @extension ERC4337
 * @example
 * ```
 * import { withdrawStake } from "thirdweb/extensions/erc4337";
 *
 * const transaction = withdrawStake({
 *  withdrawAddress: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function withdrawStake(
  options: BaseTransactionOptions<WithdrawStakeParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xc23a5cea",
      [
        {
          type: "address",
          name: "withdrawAddress",
        },
      ],
      [],
    ],
    params: [options.withdrawAddress],
  });
}
