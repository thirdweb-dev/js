import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithValue,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";

/**
 * Represents the parameters for the "withdrawStake" function.
 */
export type WithdrawStakeParams = WithValue<{
  withdrawAddress: AbiParameterToPrimitiveType<{
    type: "address";
    name: "withdrawAddress";
  }>;
}>;

export const FN_SELECTOR = "0xc23a5cea" as const;
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
 * ```ts
 * import { encodeWithdrawStakeParams } "thirdweb/extensions/erc4337";
 * const result = encodeWithdrawStakeParams({
 *  withdrawAddress: ...,
 * });
 * ```
 */
export function encodeWithdrawStakeParams(options: WithdrawStakeParams) {
  return encodeAbiParameters(FN_INPUTS, [options.withdrawAddress]);
}

/**
 * Calls the "withdrawStake" function on the contract.
 * @param options - The options for the "withdrawStake" function.
 * @returns A prepared transaction object.
 * @extension ERC4337
 * @example
 * ```ts
 * import { withdrawStake } from "thirdweb/extensions/erc4337";
 *
 * const transaction = withdrawStake({
 *  contract,
 *  withdrawAddress: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function withdrawStake(
  options: BaseTransactionOptions<
    | WithdrawStakeParams
    | {
        asyncParams: () => Promise<WithdrawStakeParams>;
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
      return [resolvedParams.withdrawAddress] as const;
    },
    value: async () => (await asyncOptions()).value,
  });
}
