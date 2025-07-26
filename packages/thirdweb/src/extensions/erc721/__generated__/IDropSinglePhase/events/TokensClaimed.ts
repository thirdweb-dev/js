import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "TokensClaimed" event.
 */
export type TokensClaimedEventFilters = Partial<{
  claimer: AbiParameterToPrimitiveType<{
    type: "address";
    name: "claimer";
    indexed: true;
  }>;
  receiver: AbiParameterToPrimitiveType<{
    type: "address";
    name: "receiver";
    indexed: true;
  }>;
  startTokenId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "startTokenId";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the TokensClaimed event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ERC721
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { tokensClaimedEvent } from "thirdweb/extensions/erc721";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  tokensClaimedEvent({
 *  claimer: ...,
 *  receiver: ...,
 *  startTokenId: ...,
 * })
 * ],
 * });
 * ```
 */
export function tokensClaimedEvent(filters: TokensClaimedEventFilters = {}) {
  return prepareEvent({
    signature:
      "event TokensClaimed(address indexed claimer, address indexed receiver, uint256 indexed startTokenId, uint256 quantityClaimed)",
    filters,
  });
}
