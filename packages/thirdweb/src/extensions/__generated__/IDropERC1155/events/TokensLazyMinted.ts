import { prepareEvent } from "../../../../event/prepare-event.js";

/**
 * Creates an event object for the TokensLazyMinted event.
 * @returns The prepared event object.
 * @extension IDROPERC1155
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { tokensLazyMintedEvent } from "thirdweb/extensions/IDropERC1155";
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
