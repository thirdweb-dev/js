import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the MintableTokenURIUpdated event.
 * @returns The prepared event object.
 * @modules MintableERC1155
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { MintableERC1155 } from "thirdweb/modules";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  MintableERC1155.mintableTokenURIUpdatedEvent()
 * ],
 * });
 * ```
 */
export function mintableTokenURIUpdatedEvent() {
  return prepareEvent({
    signature:
      "event MintableTokenURIUpdated(uint256 tokenId, string tokenURI)",
  });
}
