import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "RoyaltyForToken" event.
 */
export type RoyaltyForTokenEventFilters = Partial<{
  tokenId: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "uint256";
    name: "tokenId";
    type: "uint256";
  }>;
  royaltyRecipient: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "royaltyRecipient";
    type: "address";
  }>;
}>;

/**
 * Creates an event object for the RoyaltyForToken event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension COMMON
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { royaltyForTokenEvent } from "thirdweb/extensions/common";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  royaltyForTokenEvent({
 *  tokenId: ...,
 *  royaltyRecipient: ...,
 * })
 * ],
 * });
 * ```
 */
export function royaltyForTokenEvent(
  filters: RoyaltyForTokenEventFilters = {},
) {
  return prepareEvent({
    signature:
      "event RoyaltyForToken(uint256 indexed tokenId, address indexed royaltyRecipient, uint256 royaltyBps)",
    filters,
  });
}
