import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { Prettify } from "../../../../../utils/type-utils.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "delegate" function.
 */

type DelegateParamsInternal = {
  delegatee: AbiParameterToPrimitiveType<{
    type: "address";
    name: "delegatee";
  }>;
};

export type DelegateParams = Prettify<
  | DelegateParamsInternal
  | {
      asyncParams: () => Promise<DelegateParamsInternal>;
    }
>;
const FN_SELECTOR = "0x5c19a95c" as const;
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
 * ```
 * import { encodeDelegateParams } "thirdweb/extensions/erc20";
 * const result = encodeDelegateParams({
 *  delegatee: ...,
 * });
 * ```
 */
export function encodeDelegateParams(options: DelegateParamsInternal) {
  return encodeAbiParameters(FN_INPUTS, [options.delegatee]);
}

/**
 * Calls the "delegate" function on the contract.
 * @param options - The options for the "delegate" function.
 * @returns A prepared transaction object.
 * @extension ERC20
 * @example
 * ```
 * import { delegate } from "thirdweb/extensions/erc20";
 *
 * const transaction = delegate({
 *  delegatee: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function delegate(options: BaseTransactionOptions<DelegateParams>) {
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
