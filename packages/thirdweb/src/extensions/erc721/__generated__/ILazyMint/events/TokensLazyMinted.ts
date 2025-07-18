import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "TokensLazyMinted" event.
 */
export type TokensLazyMintedEventFilters = Partial<{
  startTokenId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "startTokenId";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the TokensLazyMinted event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ERC721
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { tokensLazyMintedEvent } from "thirdweb/extensions/erc721";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  tokensLazyMintedEvent({
 *  startTokenId: ...,
 * })
 * ],
 * });
 * ```
 */
export function tokensLazyMintedEvent(
  filters: TokensLazyMintedEventFilters = {},
) {
  return prepareEvent({
    signature:
      "event TokensLazyMinted(uint256 indexed startTokenId, uint256 endTokenId, string baseURI, bytes encryptedBaseURI)",
    filters,
  });
}
