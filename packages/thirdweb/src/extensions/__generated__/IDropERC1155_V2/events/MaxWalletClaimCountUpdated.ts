import { prepareEvent } from "../../../../event/prepare-event.js";

/**
 * Creates an event object for the MaxWalletClaimCountUpdated event.
 * @returns The prepared event object.
 * @extension IDROPERC1155_V2
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { maxWalletClaimCountUpdatedEvent } from "thirdweb/extensions/IDropERC1155_V2";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  maxWalletClaimCountUpdatedEvent()
 * ],
 * });
 * ```
 */
export function maxWalletClaimCountUpdatedEvent() {
  return prepareEvent({
    signature:
      "event MaxWalletClaimCountUpdated(uint256 tokenId, uint256 count)",
  });
}
