import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "DefaultRoyaltyUpdated" event.
 */
export type DefaultRoyaltyUpdatedEventFilters = Partial<{
  recipient: AbiParameterToPrimitiveType<{
    type: "address";
    name: "recipient";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the DefaultRoyaltyUpdated event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @module RoyaltyERC1155
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { RoyaltyERC1155 } from "thirdweb/modules";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  RoyaltyERC1155.defaultRoyaltyUpdatedEvent({
 *  recipient: ...,
 * })
 * ],
 * });
 * ```
 */
export function defaultRoyaltyUpdatedEvent(
  filters: DefaultRoyaltyUpdatedEventFilters = {},
) {
  return prepareEvent({
    signature:
      "event DefaultRoyaltyUpdated(address indexed recipient, uint16 bps)",
    filters,
  });
}
