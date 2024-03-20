import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { Prettify } from "../../../../../utils/type-utils.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

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
const FN_SELECTOR = "0x16c621e0" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "_amount",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "depositRewardTokens" function.
 * @param options - The options for the depositRewardTokens function.
 * @returns The encoded ABI parameters.
 * @extension ERC20
 * @example
 * ```
 * import { encodeDepositRewardTokensParams } "thirdweb/extensions/erc20";
 * const result = encodeDepositRewardTokensParams({
 *  amount: ...,
 * });
 * ```
 */
export function encodeDepositRewardTokensParams(
  options: DepositRewardTokensParamsInternal,
) {
  return encodeAbiParameters(FN_INPUTS, [options.amount]);
}

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
