import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "TokensClaimed" event.
 */
export type TokensClaimedEventFilters = Partial<{
  claimer: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "claimer";
    type: "address";
  }>;
  receiver: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "receiver";
    type: "address";
  }>;
}>;

/**
 * Creates an event object for the TokensClaimed event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ERC721
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { tokensClaimedEvent } from "thirdweb/extensions/erc721";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  tokensClaimedEvent({
 *  claimer: ...,
 *  receiver: ...,
 * })
 * ],
 * });
 * ```
 */
export function tokensClaimedEvent(filters: TokensClaimedEventFilters = {}) {
  return prepareEvent({
    signature:
      "event TokensClaimed(address indexed claimer, address indexed receiver, uint256 quantityClaimed)",
    filters,
  });
}
