import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "TokenRoyaltyUpdate" event.
 */
export type TokenRoyaltyUpdateEventFilters = Partial<{
  tokenId: AbiParameterToPrimitiveType<{
    name: "tokenId";
    type: "uint256";
    indexed: true;
    internalType: "uint256";
  }>;
  recipient: AbiParameterToPrimitiveType<{
    name: "recipient";
    type: "address";
    indexed: true;
    internalType: "address";
  }>;
}>;

/**
 * Creates an event object for the TokenRoyaltyUpdate event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension MODULAR
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { tokenRoyaltyUpdateEvent } from "thirdweb/extensions/modular";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  tokenRoyaltyUpdateEvent({
 *  tokenId: ...,
 *  recipient: ...,
 * })
 * ],
 * });
 * ```
 */
export function tokenRoyaltyUpdateEvent(
  filters: TokenRoyaltyUpdateEventFilters = {},
) {
  return prepareEvent({
    signature:
      "event TokenRoyaltyUpdate(uint256 indexed tokenId, address indexed recipient, uint256 bps)",
    filters,
  });
}
