import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "setPlatformFeeInfo" function.
 */

type SetPlatformFeeInfoParamsInternal = {
  platformFeeRecipient: AbiParameterToPrimitiveType<{
    type: "address";
    name: "_platformFeeRecipient";
  }>;
  platformFeeBps: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_platformFeeBps";
  }>;
};

export type SetPlatformFeeInfoParams = Prettify<
  | SetPlatformFeeInfoParamsInternal
  | {
      asyncParams: () => Promise<SetPlatformFeeInfoParamsInternal>;
    }
>;
/**
 * Calls the "setPlatformFeeInfo" function on the contract.
 * @param options - The options for the "setPlatformFeeInfo" function.
 * @returns A prepared transaction object.
 * @extension COMMON
 * @example
 * ```
 * import { setPlatformFeeInfo } from "thirdweb/extensions/common";
 *
 * const transaction = setPlatformFeeInfo({
 *  platformFeeRecipient: ...,
 *  platformFeeBps: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function setPlatformFeeInfo(
  options: BaseTransactionOptions<SetPlatformFeeInfoParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x1e7ac488",
      [
        {
          type: "address",
          name: "_platformFeeRecipient",
        },
        {
          type: "uint256",
          name: "_platformFeeBps",
        },
      ],
      [],
    ],
    params:
      "asyncParams" in options
        ? async () => {
            const resolvedParams = await options.asyncParams();
            return [
              resolvedParams.platformFeeRecipient,
              resolvedParams.platformFeeBps,
            ] as const;
          }
        : [options.platformFeeRecipient, options.platformFeeBps],
  });
}
