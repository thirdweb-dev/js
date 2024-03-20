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
const METHOD = [
  "0xcb43b2dd",
  [
    {
      type: "uint256",
      name: "_amount",
    },
  ],
  [],
] as const;

/**
 * Calls the "withdrawRewardTokens" function on the contract.
 * @param options - The options for the "withdrawRewardTokens" function.
 * @returns A prepared transaction object.
 * @extension ERC721
 * @example
 * ```
 * import { withdrawRewardTokens } from "thirdweb/extensions/erc721";
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
    method: METHOD,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.amount] as const;
          }
        : [options.amount],
  });
}
