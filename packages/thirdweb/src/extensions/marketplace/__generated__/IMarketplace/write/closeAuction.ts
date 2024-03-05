import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "closeAuction" function.
 */
export type CloseAuctionParams = {
  listingId: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "_listingId";
    type: "uint256";
  }>;
  closeFor: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "_closeFor";
    type: "address";
  }>;
};

/**
 * Calls the "closeAuction" function on the contract.
 * @param options - The options for the "closeAuction" function.
 * @returns A prepared transaction object.
 * @extension MARKETPLACE
 * @example
 * ```
 * import { closeAuction } from "thirdweb/extensions/marketplace";
 *
 * const transaction = closeAuction({
 *  listingId: ...,
 *  closeFor: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function closeAuction(
  options: BaseTransactionOptions<CloseAuctionParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x6bab66ae",
      [
        {
          internalType: "uint256",
          name: "_listingId",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "_closeFor",
          type: "address",
        },
      ],
      [],
    ],
    params: [options.listingId, options.closeFor],
  });
}
