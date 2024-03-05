import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "onSignerRemoved" function.
 */
export type OnSignerRemovedParams = {
  signer: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "signer";
    type: "address";
  }>;
  creatorAdmin: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "creatorAdmin";
    type: "address";
  }>;
  data: AbiParameterToPrimitiveType<{
    internalType: "bytes";
    name: "data";
    type: "bytes";
  }>;
};

/**
 * Calls the onSignerRemoved function on the contract.
 * @param options - The options for the onSignerRemoved function.
 * @returns A prepared transaction object.
 * @extension IACCOUNTFACTORY
 * @example
 * ```
 * import { onSignerRemoved } from "thirdweb/extensions/IAccountFactory";
 *
 * const transaction = onSignerRemoved({
 *  signer: ...,
 *  creatorAdmin: ...,
 *  data: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function onSignerRemoved(
  options: BaseTransactionOptions<OnSignerRemovedParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x0db33003",
      [
        {
          internalType: "address",
          name: "signer",
          type: "address",
        },
        {
          internalType: "address",
          name: "creatorAdmin",
          type: "address",
        },
        {
          internalType: "bytes",
          name: "data",
          type: "bytes",
        },
      ],
      [],
    ],
    params: [options.signer, options.creatorAdmin, options.data],
  });
}
