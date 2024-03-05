import { prepareEvent } from "../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "TokensWrapped" event.
 */
export type TokensWrappedFilters = {
  wrapper: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "wrapper";
    type: "address";
  }>;
  recipientOfWrappedToken: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "recipientOfWrappedToken";
    type: "address";
  }>;
  tokenIdOfWrappedToken: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "uint256";
    name: "tokenIdOfWrappedToken";
    type: "uint256";
  }>;
};

/**
 * Creates an event object for the TokensWrapped event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension IMULTIWRAP
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { tokensWrappedEvent } from "thirdweb/extensions/IMultiwrap";
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
export function tokensWrappedEvent(filters: TokensWrappedFilters = {}) {
  return prepareEvent({
    signature:
      "event TokensWrapped(address indexed wrapper, address indexed recipientOfWrappedToken, uint256 indexed tokenIdOfWrappedToken, (address assetContract, uint8 tokenType, uint256 tokenId, uint256 totalAmount)[] wrappedContents)",
    filters,
  });
}
