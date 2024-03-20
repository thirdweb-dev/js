import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "setDefaultRoyaltyInfo" function.
 */

type SetDefaultRoyaltyInfoParamsInternal = {
  royaltyRecipient: AbiParameterToPrimitiveType<{
    type: "address";
    name: "_royaltyRecipient";
  }>;
  royaltyBps: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_royaltyBps";
  }>;
};

export type SetDefaultRoyaltyInfoParams = Prettify<
  | SetDefaultRoyaltyInfoParamsInternal
  | {
      asyncParams: () => Promise<SetDefaultRoyaltyInfoParamsInternal>;
    }
>;
const METHOD = [
  "0x600dd5ea",
  [
    {
      type: "address",
      name: "_royaltyRecipient",
    },
    {
      type: "uint256",
      name: "_royaltyBps",
    },
  ],
  [],
] as const;

/**
 * Calls the "setDefaultRoyaltyInfo" function on the contract.
 * @param options - The options for the "setDefaultRoyaltyInfo" function.
 * @returns A prepared transaction object.
 * @extension COMMON
 * @example
 * ```
 * import { setDefaultRoyaltyInfo } from "thirdweb/extensions/common";
 *
 * const transaction = setDefaultRoyaltyInfo({
 *  royaltyRecipient: ...,
 *  royaltyBps: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function setDefaultRoyaltyInfo(
  options: BaseTransactionOptions<SetDefaultRoyaltyInfoParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: METHOD,
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [
              resolvedParams.royaltyRecipient,
              resolvedParams.royaltyBps,
            ] as const;
          }
        : [options.royaltyRecipient, options.royaltyBps],
  });
}
