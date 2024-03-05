import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "TokenURIRevealed" event.
 */
export type TokenURIRevealedEventFilters = Partial<{
  index: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "uint256";
    name: "index";
    type: "uint256";
  }>;
}>;

/**
 * Creates an event object for the TokenURIRevealed event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ERC721
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { tokenURIRevealedEvent } from "thirdweb/extensions/erc721";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  tokenURIRevealedEvent({
 *  index: ...,
 * })
 * ],
 * });
 * ```
 */
export function tokenURIRevealedEvent(
  filters: TokenURIRevealedEventFilters = {},
) {
  return prepareEvent({
    signature:
      "event TokenURIRevealed(uint256 indexed index, string revealedURI)",
    filters,
  });
}
