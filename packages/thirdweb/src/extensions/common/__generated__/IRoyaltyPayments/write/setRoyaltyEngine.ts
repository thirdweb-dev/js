import type { AbiParameterToPrimitiveType } from "abitype";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";

/**
 * Represents the parameters for the "setRoyaltyEngine" function.
 */

export type SetRoyaltyEngineParams = {
  royaltyEngineAddress: AbiParameterToPrimitiveType<{
    type: "address";
    name: "_royaltyEngineAddress";
  }>;
};

export const FN_SELECTOR = "0x21ede032" as const;
const FN_INPUTS = [
  {
    type: "address",
    name: "_royaltyEngineAddress",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Encodes the parameters for the "setRoyaltyEngine" function.
 * @param options - The options for the setRoyaltyEngine function.
 * @returns The encoded ABI parameters.
 * @extension COMMON
 * @example
 * ```ts
 * import { encodeSetRoyaltyEngineParams } "thirdweb/extensions/common";
 * const result = encodeSetRoyaltyEngineParams({
 *  royaltyEngineAddress: ...,
 * });
 * ```
 */
export function encodeSetRoyaltyEngineParams(options: SetRoyaltyEngineParams) {
  return encodeAbiParameters(FN_INPUTS, [options.royaltyEngineAddress]);
}

/**
 * Calls the "setRoyaltyEngine" function on the contract.
 * @param options - The options for the "setRoyaltyEngine" function.
 * @returns A prepared transaction object.
 * @extension COMMON
 * @example
 * ```ts
 * import { setRoyaltyEngine } from "thirdweb/extensions/common";
 *
 * const transaction = setRoyaltyEngine({
 *  contract,
 *  royaltyEngineAddress: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function setRoyaltyEngine(
  options: BaseTransactionOptions<
    | SetRoyaltyEngineParams
    | {
        asyncParams: () => Promise<SetRoyaltyEngineParams>;
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
            return [resolvedParams.royaltyEngineAddress] as const;
          }
        : [options.royaltyEngineAddress],
  });
}
