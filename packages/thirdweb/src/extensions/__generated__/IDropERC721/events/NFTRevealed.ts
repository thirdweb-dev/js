import { prepareEvent } from "../../../../event/prepare-event.js";

/**
 * Creates an event object for the NFTRevealed event.
 * @returns The prepared event object.
 * @extension IDROPERC721
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { nFTRevealedEvent } from "thirdweb/extensions/IDropERC721";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  nFTRevealedEvent()
 * ],
 * });
 * ```
 */
export function nFTRevealedEvent() {
  return prepareEvent({
    signature: "event NFTRevealed(uint256 endTokenId, string revealedURI)",
  });
}
