import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { Prettify } from "../../../../../utils/type-utils.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "withdrawStake" function.
 */

type WithdrawStakeParamsInternal = {
  withdrawAddress: AbiParameterToPrimitiveType<{
    type: "address";
    name: "withdrawAddress";
  }>;
};

export type WithdrawStakeParams = Prettify<
  | WithdrawStakeParamsInternal
  | {
      asyncParams: () => Promise<WithdrawStakeParamsInternal>;
    }
>;
const FN_SELECTOR = "0xc23a5cea" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "withdrawAddress",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "withdrawStake" function.
 * @param options - The options for the withdrawStake function.
 * @returns The encoded ABI parameters.
 * @extension ERC4337
 * @example
 * ```
 * import { encodeWithdrawStakeParams } "thirdweb/extensions/erc4337";
 * const result = encodeWithdrawStakeParams({
 *  withdrawAddress: ...,
 * });
 * ```
 */
export function encodeWithdrawStakeParams(
  options: WithdrawStakeParamsInternal,
) {
  return encodeAbiParameters(FN_INPUTS, [options.withdrawAddress]);
}

/**
 * Calls the "withdrawStake" function on the contract.
 * @param options - The options for the "withdrawStake" function.
 * @returns A prepared transaction object.
 * @extension ERC4337
 * @example
 * ```
 * import { withdrawStake } from "thirdweb/extensions/erc4337";
 *
 * const transaction = withdrawStake({
 *  withdrawAddress: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function withdrawStake(
  options: BaseTransactionOptions<WithdrawStakeParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [resolvedParams.withdrawAddress] as const;
          }
        : [options.withdrawAddress],
  });
}
