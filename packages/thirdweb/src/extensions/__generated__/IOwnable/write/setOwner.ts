import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "setOwner" function.
 */
export type SetOwnerParams = {
  newOwner: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "_newOwner";
    type: "address";
  }>;
};

/**
 * Calls the setOwner function on the contract.
 * @param options - The options for the setOwner function.
 * @returns A prepared transaction object.
 * @extension IOWNABLE
 * @example
 * ```
 * import { setOwner } from "thirdweb/extensions/IOwnable";
 *
 * const transaction = setOwner({
 *  newOwner: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function setOwner(options: BaseTransactionOptions<SetOwnerParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x13af4035",
      [
        {
          internalType: "address",
          name: "_newOwner",
          type: "address",
        },
      ],
      [],
    ],
    params: [options.newOwner],
  });
}
