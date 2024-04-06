import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "withdraw" function.
 */

export type WithdrawParams = {
  amount: AbiParameterToPrimitiveType<{ type: "uint256"; name: "amount" }>;
};

export const FN_SELECTOR = "0x2e1a7d4d" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "amount",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "withdraw" function.
 * @param options - The options for the withdraw function.
 * @returns The encoded ABI parameters.
 * @extension ERC20
 * @example
 * ```ts
 * import { encodeWithdrawParams } "thirdweb/extensions/erc20";
 * const result = encodeWithdrawParams({
 *  amount: ...,
 * });
 * ```
 */
export function encodeWithdrawParams(options: WithdrawParams) {
  return encodeAbiParameters(FN_INPUTS, [options.amount]);
}

/**
 * Calls the "withdraw" function on the contract.
 * @param options - The options for the "withdraw" function.
 * @returns A prepared transaction object.
 * @extension ERC20
 * @example
 * ```ts
 * import { withdraw } from "thirdweb/extensions/erc20";
 *
 * const transaction = withdraw({
 *  contract,
 *  amount: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function withdraw(
  options: BaseTransactionOptions<
    | WithdrawParams
    | {
        asyncParams: () => Promise<WithdrawParams>;
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
