import { prepareEvent } from "../../../../event/prepare-event.js";

/**
 * Creates an event object for the MaxWalletClaimCountUpdated event.
 * @returns The prepared event object.
 * @extension IDROPERC20_V2
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { maxWalletClaimCountUpdatedEvent } from "thirdweb/extensions/IDropERC20_V2";
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
    signature: "event MaxWalletClaimCountUpdated(uint256 count)",
  });
}
