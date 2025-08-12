import type { AbiParameterToPrimitiveType } from "abitype";
import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Represents the filters for the "TokensWrapped" event.
 */
export type TokensWrappedEventFilters = Partial<{
  wrapper: AbiParameterToPrimitiveType<{
    type: "address";
    name: "wrapper";
    indexed: true;
  }>;
  recipientOfWrappedToken: AbiParameterToPrimitiveType<{
    type: "address";
    name: "recipientOfWrappedToken";
    indexed: true;
  }>;
  tokenIdOfWrappedToken: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "tokenIdOfWrappedToken";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the TokensWrapped event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ERC721
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { tokensWrappedEvent } from "thirdweb/extensions/erc721";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  tokensWrappedEvent({
 *  wrapper: ...,
 *  recipientOfWrappedToken: ...,
 *  tokenIdOfWrappedToken: ...,
 * })
 * ],
 * });
 * ```
 */
export function tokensWrappedEvent(filters: TokensWrappedEventFilters = {}) {
  return prepareEvent({
    filters,
    signature:
      "event TokensWrapped(address indexed wrapper, address indexed recipientOfWrappedToken, uint256 indexed tokenIdOfWrappedToken, (address assetContract, uint8 tokenType, uint256 tokenId, uint256 amount)[] wrappedContents)",
  });
}
