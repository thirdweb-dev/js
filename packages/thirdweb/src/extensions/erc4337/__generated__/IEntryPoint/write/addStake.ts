import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "addStake" function.
 */

type AddStakeParamsInternal = {
  unstakeDelaySec: AbiParameterToPrimitiveType<{
    type: "uint32";
    name: "_unstakeDelaySec";
  }>;
};

export type AddStakeParams = Prettify<
  | AddStakeParamsInternal
  | {
      asyncParams: () => Promise<AddStakeParamsInternal>;
    }
>;
/**
 * Calls the "addStake" function on the contract.
 * @param options - The options for the "addStake" function.
 * @returns A prepared transaction object.
 * @extension ERC4337
 * @example
 * ```
 * import { addStake } from "thirdweb/extensions/erc4337";
 *
 * const transaction = addStake({
 *  unstakeDelaySec: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function addStake(options: BaseTransactionOptions<AddStakeParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x0396cb60",
      [
        {
          type: "uint32",
          name: "_unstakeDelaySec",
        },
      ],
      [],
    ],
    params: async () => {
      if ("asyncParams" in options) {
        const resolvedParams = await options.asyncParams();
        return [resolvedParams.unstakeDelaySec] as const;
      }

      return [options.unstakeDelaySec] as const;
    },
  });
}
