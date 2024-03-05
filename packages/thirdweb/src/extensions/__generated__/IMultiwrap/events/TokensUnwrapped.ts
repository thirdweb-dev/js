import { prepareEvent } from "../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "TokensUnwrapped" event.
 */
export type TokensUnwrappedFilters = {
  unwrapper: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "unwrapper";
    type: "address";
  }>;
  recipientOfWrappedContents: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "recipientOfWrappedContents";
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
 * Creates an event object for the TokensUnwrapped event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension IMULTIWRAP
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { tokensUnwrappedEvent } from "thirdweb/extensions/IMultiwrap";
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
export function tokensUnwrappedEvent(filters: TokensUnwrappedFilters = {}) {
  return prepareEvent({
    signature:
      "event TokensUnwrapped(address indexed unwrapper, address indexed recipientOfWrappedContents, uint256 indexed tokenIdOfWrappedToken)",
    filters,
  });
}
