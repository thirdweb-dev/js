import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the PlatformFeeTypeUpdated event.
 * @returns The prepared event object.
 * @extension MARKETPLACE
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { platformFeeTypeUpdatedEvent } from "thirdweb/extensions/marketplace";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  platformFeeTypeUpdatedEvent()
 * ],
 * });
 * ```
 */
export function platformFeeTypeUpdatedEvent() {
  return prepareEvent({
    signature: "event PlatformFeeTypeUpdated(uint8 feeType)",
  });
}
