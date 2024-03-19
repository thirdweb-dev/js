import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "depositRewardTokens" function.
 */

type DepositRewardTokensParamsInternal = {
  amount: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_amount" }>;
};

export type DepositRewardTokensParams = Prettify<
  | DepositRewardTokensParamsInternal
  | {
      asyncParams: () => Promise<DepositRewardTokensParamsInternal>;
    }
>;
/**
 * Calls the "depositRewardTokens" function on the contract.
 * @param options - The options for the "depositRewardTokens" function.
 * @returns A prepared transaction object.
 * @extension ERC721
 * @example
 * ```
 * import { depositRewardTokens } from "thirdweb/extensions/erc721";
 *
 * const transaction = depositRewardTokens({
 *  amount: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function depositRewardTokens(
  options: BaseTransactionOptions<DepositRewardTokensParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x16c621e0",
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
