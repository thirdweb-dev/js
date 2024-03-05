import { prepareEvent } from "../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "PlatformFeeInfoUpdated" event.
 */
export type PlatformFeeInfoUpdatedFilters = {
  platformFeeRecipient: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "platformFeeRecipient";
    type: "address";
  }>;
};

/**
 * Creates an event object for the PlatformFeeInfoUpdated event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension IPLATFORMFEE
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { platformFeeInfoUpdatedEvent } from "thirdweb/extensions/IPlatformFee";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  platformFeeInfoUpdatedEvent({
 *  platformFeeRecipient: ...,
 * })
 * ],
 * });
 * ```
 */
export function platformFeeInfoUpdatedEvent(
  filters: PlatformFeeInfoUpdatedFilters = {},
) {
  return prepareEvent({
    signature:
      "event PlatformFeeInfoUpdated(address indexed platformFeeRecipient, uint256 platformFeeBps)",
    filters,
  });
}
