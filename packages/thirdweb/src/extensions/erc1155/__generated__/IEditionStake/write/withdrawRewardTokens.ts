import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "withdrawRewardTokens" function.
 */
export type WithdrawRewardTokensParams = {
  amount: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "_amount";
    type: "uint256";
  }>;
};

/**
 * Calls the "withdrawRewardTokens" function on the contract.
 * @param options - The options for the "withdrawRewardTokens" function.
 * @returns A prepared transaction object.
 * @extension ERC1155
 * @example
 * ```
 * import { withdrawRewardTokens } from "thirdweb/extensions/erc1155";
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
          internalType: "uint256",
          name: "_amount",
          type: "uint256",
        },
      ],
      [],
    ],
    params: [options.amount],
  });
}
