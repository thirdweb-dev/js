import type { AbiParameterToPrimitiveType } from "abitype";
import { prepareEvent } from "../../../../../event/prepare-event.js";

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
 * @modules RoyaltyERC721
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { RoyaltyERC721 } from "thirdweb/modules";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  RoyaltyERC721.defaultRoyaltyUpdatedEvent({
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
    filters,
    signature:
      "event DefaultRoyaltyUpdated(address indexed recipient, uint256 bps)",
  });
}
