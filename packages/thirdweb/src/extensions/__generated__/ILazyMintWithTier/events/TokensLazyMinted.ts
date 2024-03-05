import { prepareEvent } from "../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "TokensLazyMinted" event.
 */
export type TokensLazyMintedFilters = {
  tier: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "string";
    name: "tier";
    type: "string";
  }>;
  startTokenId: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "uint256";
    name: "startTokenId";
    type: "uint256";
  }>;
};

/**
 * Creates an event object for the TokensLazyMinted event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ILAZYMINTWITHTIER
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { tokensLazyMintedEvent } from "thirdweb/extensions/ILazyMintWithTier";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  tokensLazyMintedEvent({
 *  tier: ...,
 *  startTokenId: ...,
 * })
 * ],
 * });
 * ```
 */
export function tokensLazyMintedEvent(filters: TokensLazyMintedFilters = {}) {
  return prepareEvent({
    signature:
      "event TokensLazyMinted(string indexed tier, uint256 indexed startTokenId, uint256 endTokenId, string baseURI, bytes encryptedBaseURI)",
    filters,
  });
}
