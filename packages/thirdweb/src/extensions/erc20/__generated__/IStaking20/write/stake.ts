import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "stake" function.
 */

type StakeParamsInternal = {
  amount: AbiParameterToPrimitiveType<{ type: "uint256"; name: "amount" }>;
};

export type StakeParams = Prettify<
  | StakeParamsInternal
  | {
      asyncParams: () => Promise<StakeParamsInternal>;
    }
>;
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
    params: async () => {
      if ("asyncParams" in options) {
        const resolvedParams = await options.asyncParams();
        return [resolvedParams.amount] as const;
      }

      return [options.amount] as const;
    },
  });
}
