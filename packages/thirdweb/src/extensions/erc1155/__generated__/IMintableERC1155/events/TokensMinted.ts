import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "TokensMinted" event.
 */
export type TokensMintedEventFilters = Partial<{
  mintedTo: AbiParameterToPrimitiveType<{
    type: "address";
    name: "mintedTo";
    indexed: true;
  }>;
  tokenIdMinted: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "tokenIdMinted";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the TokensMinted event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ERC1155
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { tokensMintedEvent } from "thirdweb/extensions/erc1155";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  tokensMintedEvent({
 *  mintedTo: ...,
 *  tokenIdMinted: ...,
 * })
 * ],
 * });
 * ```
 */
export function tokensMintedEvent(filters: TokensMintedEventFilters = {}) {
  return prepareEvent({
    signature:
      "event TokensMinted(address indexed mintedTo, uint256 indexed tokenIdMinted, string uri, uint256 quantityMinted)",
    filters,
  });
}
