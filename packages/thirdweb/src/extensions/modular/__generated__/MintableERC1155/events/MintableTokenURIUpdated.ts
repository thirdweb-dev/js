import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the MintableTokenURIUpdated event.
 * @returns The prepared event object.
 * @extension MODULAR
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { mintableTokenURIUpdatedEvent } from "thirdweb/extensions/modular";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  mintableTokenURIUpdatedEvent()
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
