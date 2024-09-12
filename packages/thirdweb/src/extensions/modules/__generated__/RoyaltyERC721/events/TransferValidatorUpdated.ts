import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the TransferValidatorUpdated event.
 * @returns The prepared event object.
 * @modules RoyaltyERC721
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { RoyaltyERC721 } from "thirdweb/modules";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  RoyaltyERC721.transferValidatorUpdatedEvent()
 * ],
 * });
 * ```
 */
export function transferValidatorUpdatedEvent() {
  return prepareEvent({
    signature:
      "event TransferValidatorUpdated(address oldValidator, address newValidator)",
  });
}
