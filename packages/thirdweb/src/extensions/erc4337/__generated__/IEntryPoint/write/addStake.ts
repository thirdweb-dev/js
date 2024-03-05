import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "addStake" function.
 */
export type AddStakeParams = {
  unstakeDelaySec: AbiParameterToPrimitiveType<{
    type: "uint32";
    name: "_unstakeDelaySec";
  }>;
};

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
    params: [options.unstakeDelaySec],
  });
}
