import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { prepareContractCall } from "../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "cancelAuction" function.
 */
export type CancelAuctionParams = {
  auctionId: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "_auctionId";
    type: "uint256";
  }>;
};

/**
 * Calls the cancelAuction function on the contract.
 * @param options - The options for the cancelAuction function.
 * @returns A prepared transaction object.
 * @extension IENGLISHAUCTIONS
 * @example
 * ```
 * import { cancelAuction } from "thirdweb/extensions/IEnglishAuctions";
 *
 * const transaction = cancelAuction({
 *  auctionId: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function cancelAuction(
  options: BaseTransactionOptions<CancelAuctionParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x96b5a755",
      [
        {
          internalType: "uint256",
          name: "_auctionId",
          type: "uint256",
        },
      ],
      [],
    ],
    params: [options.auctionId],
  });
}
