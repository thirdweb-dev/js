import type { BaseTransactionOptions } from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the parameters for the "createAuction" function.
 */
export type CreateAuctionParams = {
  params: AbiParameterToPrimitiveType<{
    type: "tuple";
    name: "_params";
    components: [
      { type: "address"; name: "assetContract" },
      { type: "uint256"; name: "tokenId" },
      { type: "uint256"; name: "quantity" },
      { type: "address"; name: "currency" },
      { type: "uint256"; name: "minimumBidAmount" },
      { type: "uint256"; name: "buyoutBidAmount" },
      { type: "uint64"; name: "timeBufferInSeconds" },
      { type: "uint64"; name: "bidBufferBps" },
      { type: "uint64"; name: "startTimestamp" },
      { type: "uint64"; name: "endTimestamp" },
    ];
  }>;
};

/**
 * Calls the "createAuction" function on the contract.
 * @param options - The options for the "createAuction" function.
 * @returns A prepared transaction object.
 * @extension MARKETPLACE
 * @example
 * ```
 * import { createAuction } from "thirdweb/extensions/marketplace";
 *
 * const transaction = createAuction({
 *  params: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function createAuction(
  options: BaseTransactionOptions<CreateAuctionParams>,
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x16654d40",
      [
        {
          type: "tuple",
          name: "_params",
          components: [
            {
              type: "address",
              name: "assetContract",
            },
            {
              type: "uint256",
              name: "tokenId",
            },
            {
              type: "uint256",
              name: "quantity",
            },
            {
              type: "address",
              name: "currency",
            },
            {
              type: "uint256",
              name: "minimumBidAmount",
            },
            {
              type: "uint256",
              name: "buyoutBidAmount",
            },
            {
              type: "uint64",
              name: "timeBufferInSeconds",
            },
            {
              type: "uint64",
              name: "bidBufferBps",
            },
            {
              type: "uint64",
              name: "startTimestamp",
            },
            {
              type: "uint64",
              name: "endTimestamp",
            },
          ],
        },
      ],
      [
        {
          type: "uint256",
          name: "auctionId",
        },
      ],
    ],
    params: [options.params],
  });
}
