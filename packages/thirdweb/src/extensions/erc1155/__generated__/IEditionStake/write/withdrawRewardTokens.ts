import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithValue,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";

/**
 * Represents the parameters for the "withdrawRewardTokens" function.
 */
export type WithdrawRewardTokensParams = WithValue<{
  amount: AbiParameterToPrimitiveType<{ type: "uint256"; name: "_amount" }>;
}>;

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
 * @extension ERC1155
 * @example
 * ```ts
 * import { encodeWithdrawRewardTokensParams } "thirdweb/extensions/erc1155";
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
 * @extension ERC1155
 * @example
 * ```ts
 * import { withdrawRewardTokens } from "thirdweb/extensions/erc1155";
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
  const asyncOptions = once(async () => {
    return "asyncParams" in options ? await options.asyncParams() : options;
  });

  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: async () => {
      const resolvedParams = await asyncOptions();
      return [resolvedParams.amount] as const;
    },
    value: async () => (await asyncOptions()).value,
  });
}
