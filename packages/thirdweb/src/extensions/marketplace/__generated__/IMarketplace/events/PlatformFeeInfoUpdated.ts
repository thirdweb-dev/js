import type { AbiParameterToPrimitiveType } from "abitype";
import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Represents the filters for the "PlatformFeeInfoUpdated" event.
 */
export type PlatformFeeInfoUpdatedEventFilters = Partial<{
  platformFeeRecipient: AbiParameterToPrimitiveType<{
    type: "address";
    name: "platformFeeRecipient";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the PlatformFeeInfoUpdated event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension MARKETPLACE
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { platformFeeInfoUpdatedEvent } from "thirdweb/extensions/marketplace";
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
  filters: PlatformFeeInfoUpdatedEventFilters = {},
) {
  return prepareEvent({
    filters,
    signature:
      "event PlatformFeeInfoUpdated(address indexed platformFeeRecipient, uint256 platformFeeBps)",
  });
}
