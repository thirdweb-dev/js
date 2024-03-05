import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "updateCodeHash" function.
 */
export type UpdateCodeHashParams = {
  registrant: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "registrant";
    type: "address";
  }>;
  codehash: AbiParameterToPrimitiveType<{
    internalType: "bytes32";
    name: "codehash";
    type: "bytes32";
  }>;
  filtered: AbiParameterToPrimitiveType<{
    internalType: "bool";
    name: "filtered";
    type: "bool";
  }>;
};

/**
 * Calls the updateCodeHash function on the contract.
 * @param options - The options for the updateCodeHash function.
 * @returns A prepared transaction object.
 * @extension IOPERATORFILTERREGISTRY
 * @example
 * ```
 * import { updateCodeHash } from "thirdweb/extensions/IOperatorFilterRegistry";
 *
 * const transaction = updateCodeHash({
 *  registrant: ...,
 *  codehash: ...,
 *  filtered: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function updateCodeHash(
  options: BaseTransactionOptions<UpdateCodeHashParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x712fc00b",
      [
        {
          internalType: "address",
          name: "registrant",
          type: "address",
        },
        {
          internalType: "bytes32",
          name: "codehash",
          type: "bytes32",
        },
        {
          internalType: "bool",
          name: "filtered",
          type: "bool",
        },
      ],
      [],
    ],
    params: [options.registrant, options.codehash, options.filtered],
  });
}
