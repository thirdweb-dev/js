import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "withdrawRewardTokens" function.
 */

export type WithdrawRewardTokensParams = {
  amount: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_amount" }>;
};

export const FN_SELECTOR = "0xcb43b2dd" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "_amount",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "withdrawRewardTokens" function.
 * @param options - The options for the withdrawRewardTokens function.
 * @returns The encoded ABI parameters.
 * @extension ERC721
 * @example
 * ```ts
 * import { encodeWithdrawRewardTokensParams } "thirdweb/extensions/erc721";
 * const result = encodeWithdrawRewardTokensParams({
 *  amount: ...,
 * });
 * ```
 */
export function encodeWithdrawRewardTokensParams(
  options: WithdrawRewardTokensParams,
) {
  return encodeAbiParameters(FN_INPUTS, [options.amount]);
}

/**
 * Calls the "withdrawRewardTokens" function on the contract.
 * @param options - The options for the "withdrawRewardTokens" function.
 * @returns A prepared transaction object.
 * @extension ERC721
 * @example
 * ```ts
 * import { withdrawRewardTokens } from "thirdweb/extensions/erc721";
 *
 * const transaction = withdrawRewardTokens({
 *  contract,
 *  amount: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function withdrawRewardTokens(
  options: BaseTransactionOptions<
    | WithdrawRewardTokensParams
    | {
        asyncParams: () => Promise<WithdrawRewardTokensParams>;
      }
  >,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.amount] as const;
          }
        : [options.amount],
  });
}
