import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";
import type { Prettify } from "../../../../../utils/type-utils.js";

/**
 * Represents the parameters for the "closeAuction" function.
 */

type CloseAuctionParamsInternal = {
  listingId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_listingId";
  }>;
  closeFor: AbiParameterToPrimitiveType<{ type: "address"; name: "_closeFor" }>;
};

export type CloseAuctionParams = Prettify<
  | CloseAuctionParamsInternal
  | {
      asyncParams: () => Promise<CloseAuctionParamsInternal>;
    }
>;
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
          type: "uint256",
          name: "_listingId",
        },
        {
          type: "address",
          name: "_closeFor",
        },
      ],
      [],
    ],
    params: async () => {
      if ("asyncParams" in options) {
        const resolvedParams = await options.asyncParams();
        return [resolvedParams.listingId, resolvedParams.closeFor] as const;
      }

      return [options.listingId, options.closeFor] as const;
    },
  });
}
