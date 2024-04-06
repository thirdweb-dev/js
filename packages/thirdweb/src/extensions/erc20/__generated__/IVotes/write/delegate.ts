import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "delegate" function.
 */

export type DelegateParams = {
  delegatee: AbiParameterToPrimitiveType<{
    type: "address";
    name: "delegatee";
  }>;
};

export const FN_SELECTOR = "0x5c19a95c" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "delegatee",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "delegate" function.
 * @param options - The options for the delegate function.
 * @returns The encoded ABI parameters.
 * @extension ERC20
 * @example
 * ```ts
 * import { encodeDelegateParams } "thirdweb/extensions/erc20";
 * const result = encodeDelegateParams({
 *  delegatee: ...,
 * });
 * ```
 */
export function encodeDelegateParams(options: DelegateParams) {
  return encodeAbiParameters(FN_INPUTS, [options.delegatee]);
}

/**
 * Calls the "delegate" function on the contract.
 * @param options - The options for the "delegate" function.
 * @returns A prepared transaction object.
 * @extension ERC20
 * @example
 * ```ts
 * import { delegate } from "thirdweb/extensions/erc20";
 *
 * const transaction = delegate({
 *  contract,
 *  delegatee: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function delegate(
  options: BaseTransactionOptions<
    | DelegateParams
    | {
        asyncParams: () => Promise<DelegateParams>;
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
            return [resolvedParams.delegatee] as const;
          }
        : [options.delegatee],
  });
}
