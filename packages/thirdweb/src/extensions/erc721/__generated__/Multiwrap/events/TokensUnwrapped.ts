import type { AbiParameterToPrimitiveType } from "abitype";
import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Represents the filters for the "TokensUnwrapped" event.
 */
export type TokensUnwrappedEventFilters = Partial<{
  unwrapper: AbiParameterToPrimitiveType<{
    type: "address";
    name: "unwrapper";
    indexed: true;
  }>;
  recipientOfWrappedContents: AbiParameterToPrimitiveType<{
    type: "address";
    name: "recipientOfWrappedContents";
    indexed: true;
  }>;
  tokenIdOfWrappedToken: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "tokenIdOfWrappedToken";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the TokensUnwrapped event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ERC721
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { tokensUnwrappedEvent } from "thirdweb/extensions/erc721";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  tokensUnwrappedEvent({
 *  unwrapper: ...,
 *  recipientOfWrappedContents: ...,
 *  tokenIdOfWrappedToken: ...,
 * })
 * ],
 * });
 * ```
 */
export function tokensUnwrappedEvent(
  filters: TokensUnwrappedEventFilters = {},
) {
  return prepareEvent({
    filters,
    signature:
      "event TokensUnwrapped(address indexed unwrapper, address indexed recipientOfWrappedContents, uint256 indexed tokenIdOfWrappedToken)",
  });
}
