import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

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
    method: [
      "0x5c19a95c",
      [
        {
          type: "address",
          name: "delegatee",
        },
      ],
      [],
    ],
    params: async () => {
      if ("asyncParams" in options) {
        const resolvedParams = await options.asyncParams();
        return [resolvedParams.delegatee] as const;
      }

      return [options.delegatee] as const;
    },
  });
}
