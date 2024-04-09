import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "setOwner" function.
 */

export type SetOwnerParams = {
  newOwner: AbiParameterToPrimitiveType<{ type: "address"; name: "newOwner" }>;
};

export const FN_SELECTOR = "0x13af4035" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "newOwner",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "setOwner" function.
 * @param options - The options for the setOwner function.
 * @returns The encoded ABI parameters.
 * @extension UNISWAP
 * @example
 * ```ts
 * import { encodeSetOwnerParams } "thirdweb/extensions/uniswap";
 * const result = encodeSetOwnerParams({
 *  newOwner: ...,
 * });
 * ```
 */
export function encodeSetOwnerParams(options: SetOwnerParams) {
  return encodeAbiParameters(FN_INPUTS, [options.newOwner]);
}

/**
 * Calls the "setOwner" function on the contract.
 * @param options - The options for the "setOwner" function.
 * @returns A prepared transaction object.
 * @extension UNISWAP
 * @example
 * ```ts
 * import { setOwner } from "thirdweb/extensions/uniswap";
 *
 * const transaction = setOwner({
 *  contract,
 *  newOwner: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function setOwner(
  options: BaseTransactionOptions<
    | SetOwnerParams
    | {
        asyncParams: () => Promise<SetOwnerParams>;
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
            return [resolvedParams.newOwner] as const;
          }
        : [options.newOwner],
  });
}
