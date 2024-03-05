import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "DefaultRoyalty" event.
 */
export type DefaultRoyaltyEventFilters = Partial<{
  newRoyaltyRecipient: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "newRoyaltyRecipient";
    type: "address";
  }>;
}>;

/**
 * Creates an event object for the DefaultRoyalty event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ERC721
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { defaultRoyaltyEvent } from "thirdweb/extensions/erc721";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  defaultRoyaltyEvent({
 *  newRoyaltyRecipient: ...,
 * })
 * ],
 * });
 * ```
 */
export function defaultRoyaltyEvent(filters: DefaultRoyaltyEventFilters = {}) {
  return prepareEvent({
    signature:
      "event DefaultRoyalty(address indexed newRoyaltyRecipient, uint256 newRoyaltyBps)",
    filters,
  });
}
