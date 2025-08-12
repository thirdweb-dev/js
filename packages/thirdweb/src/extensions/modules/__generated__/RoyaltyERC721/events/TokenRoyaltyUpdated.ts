import type { AbiParameterToPrimitiveType } from "abitype";
import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Represents the filters for the "TokenRoyaltyUpdated" event.
 */
export type TokenRoyaltyUpdatedEventFilters = Partial<{
  tokenId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "tokenId";
    indexed: true;
  }>;
  recipient: AbiParameterToPrimitiveType<{
    type: "address";
    name: "recipient";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the TokenRoyaltyUpdated event.
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
 *  RoyaltyERC721.tokenRoyaltyUpdatedEvent({
 *  tokenId: ...,
 *  recipient: ...,
 * })
 * ],
 * });
 * ```
 */
export function tokenRoyaltyUpdatedEvent(
  filters: TokenRoyaltyUpdatedEventFilters = {},
) {
  return prepareEvent({
    filters,
    signature:
      "event TokenRoyaltyUpdated(uint256 indexed tokenId, address indexed recipient, uint16 bps)",
  });
}
