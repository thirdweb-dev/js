import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "addStake" function.
 */
export type AddStakeParams = {
  unstakeDelaySec: AbiParameterToPrimitiveType<{
    internalType: "uint32";
    name: "_unstakeDelaySec";
    type: "uint32";
  }>;
};

/**
 * Calls the addStake function on the contract.
 * @param options - The options for the addStake function.
 * @returns A prepared transaction object.
 * @extension IENTRYPOINT
 * @example
 * ```
 * import { addStake } from "thirdweb/extensions/IEntryPoint";
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
          internalType: "uint32",
          name: "_unstakeDelaySec",
          type: "uint32",
        },
      ],
      [],
    ],
    params: [options.unstakeDelaySec],
  });
}
