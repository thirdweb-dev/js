import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the TokensLazyMinted event.
 * @returns The prepared event object.
 * @extension ERC1155
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { tokensLazyMintedEvent } from "thirdweb/extensions/erc1155";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  tokensLazyMintedEvent()
 * ],
 * });
 * ```
 */
export function tokensLazyMintedEvent() {
  return prepareEvent({
    signature:
      "event TokensLazyMinted(uint256 startTokenId, uint256 endTokenId, string baseURI)",
  });
}
