import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "stake" function.
 */

export type StakeParams = {
  amount: AbiParameterToPrimitiveType<{ type: "uint256"; name: "amount" }>;
};

export const FN_SELECTOR = "0xa694fc3a" as const;
const FN_INPUTS = [
  {
    type: "uint256",
    name: "amount",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "stake" function.
 * @param options - The options for the stake function.
 * @returns The encoded ABI parameters.
 * @extension ERC20
 * @example
 * ```ts
 * import { encodeStakeParams } "thirdweb/extensions/erc20";
 * const result = encodeStakeParams({
 *  amount: ...,
 * });
 * ```
 */
export function encodeStakeParams(options: StakeParams) {
  return encodeAbiParameters(FN_INPUTS, [options.amount]);
}

/**
 * Calls the "stake" function on the contract.
 * @param options - The options for the "stake" function.
 * @returns A prepared transaction object.
 * @extension ERC20
 * @example
 * ```ts
 * import { stake } from "thirdweb/extensions/erc20";
 *
 * const transaction = stake({
 *  contract,
 *  amount: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function stake(
  options: BaseTransactionOptions<
    | StakeParams
    | {
        asyncParams: () => Promise<StakeParams>;
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
