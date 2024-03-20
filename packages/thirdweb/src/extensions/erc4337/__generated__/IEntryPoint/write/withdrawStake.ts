import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "withdrawStake" function.
 */

type WithdrawStakeParamsInternal = {
  withdrawAddress: AbiParameterToPrimitiveType<{
    type: "address";
    name: "withdrawAddress";
  }>;
};

export type WithdrawStakeParams = Prettify<
  | WithdrawStakeParamsInternal
  | {
      asyncParams: () => Promise<WithdrawStakeParamsInternal>;
    }
>;
const METHOD = [
  "0xc23a5cea",
  [
    {
      type: "address",
      name: "withdrawAddress",
    },
  ],
  [],
] as const;

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
    method: METHOD,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.withdrawAddress] as const;
          }
        : [options.withdrawAddress],
  });
}
