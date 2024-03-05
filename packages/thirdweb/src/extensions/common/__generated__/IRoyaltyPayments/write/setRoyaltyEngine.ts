import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "setRoyaltyEngine" function.
 */
export type SetRoyaltyEngineParams = {
  royaltyEngineAddress: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "_royaltyEngineAddress";
    type: "address";
  }>;
};

/**
 * Calls the "setRoyaltyEngine" function on the contract.
 * @param options - The options for the "setRoyaltyEngine" function.
 * @returns A prepared transaction object.
 * @extension COMMON
 * @example
 * ```
 * import { setRoyaltyEngine } from "thirdweb/extensions/common";
 *
 * const transaction = setRoyaltyEngine({
 *  royaltyEngineAddress: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function setRoyaltyEngine(
  options: BaseTransactionOptions<SetRoyaltyEngineParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x21ede032",
      [
        {
          internalType: "address",
          name: "_royaltyEngineAddress",
          type: "address",
        },
      ],
      [],
    ],
    params: [options.royaltyEngineAddress],
  });
}
