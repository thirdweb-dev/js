import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the FlatPlatformFeeUpdated event.
 * @returns The prepared event object.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { flatPlatformFeeUpdatedEvent } from "thirdweb/extensions/marketplace";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  flatPlatformFeeUpdatedEvent()
 * ],
 * });
 * ```
 */
export function flatPlatformFeeUpdatedEvent() {
  return prepareEvent({
    signature:
      "event FlatPlatformFeeUpdated(address platformFeeRecipient, uint256 flatFee)",
  });
}
