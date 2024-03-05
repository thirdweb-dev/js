import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "depositRewardTokens" function.
 */
export type DepositRewardTokensParams = {
  amount: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "_amount";
    type: "uint256";
  }>;
};

/**
 * Calls the "depositRewardTokens" function on the contract.
 * @param options - The options for the "depositRewardTokens" function.
 * @returns A prepared transaction object.
 * @extension ERC20
 * @example
 * ```
 * import { depositRewardTokens } from "thirdweb/extensions/erc20";
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
