import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "addStake" function.
 */

export type AddStakeParams = {
  unstakeDelaySec: AbiParameterToPrimitiveType<{
    type: "uint32";
    name: "_unstakeDelaySec";
  }>;
};

export const FN_SELECTOR = "0x0396cb60" as const;
const FN_INPUTS = [
  {
    type: "uint32",
    name: "_unstakeDelaySec",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "addStake" function.
 * @param options - The options for the addStake function.
 * @returns The encoded ABI parameters.
 * @extension ERC4337
 * @example
 * ```ts
 * import { encodeAddStakeParams } "thirdweb/extensions/erc4337";
 * const result = encodeAddStakeParams({
 *  unstakeDelaySec: ...,
 * });
 * ```
 */
export function encodeAddStakeParams(options: AddStakeParams) {
  return encodeAbiParameters(FN_INPUTS, [options.unstakeDelaySec]);
}

/**
 * Calls the "addStake" function on the contract.
 * @param options - The options for the "addStake" function.
 * @returns A prepared transaction object.
 * @extension ERC4337
 * @example
 * ```ts
 * import { addStake } from "thirdweb/extensions/erc4337";
 *
 * const transaction = addStake({
 *  contract,
 *  unstakeDelaySec: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function addStake(
  options: BaseTransactionOptions<
    | AddStakeParams
    | {
        asyncParams: () => Promise<AddStakeParams>;
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
            return [resolvedParams.unstakeDelaySec] as const;
          }
        : [options.unstakeDelaySec],
  });
}
