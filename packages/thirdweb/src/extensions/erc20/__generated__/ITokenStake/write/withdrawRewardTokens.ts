import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "withdrawRewardTokens" function.
 */

type WithdrawRewardTokensParamsInternal = {
  amount: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_amount" }>;
};

export type WithdrawRewardTokensParams = Prettify<
  | WithdrawRewardTokensParamsInternal
  | {
      asyncParams: () => Promise<WithdrawRewardTokensParamsInternal>;
    }
>;
/**
 * Calls the "withdrawRewardTokens" function on the contract.
 * @param options - The options for the "withdrawRewardTokens" function.
 * @returns A prepared transaction object.
 * @extension ERC20
 * @example
 * ```
 * import { withdrawRewardTokens } from "thirdweb/extensions/erc20";
 *
 * const transaction = withdrawRewardTokens({
 *  amount: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function withdrawRewardTokens(
  options: BaseTransactionOptions<WithdrawRewardTokensParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xcb43b2dd",
      [
        {
          type: "uint256",
          name: "_amount",
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
