import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the HooksUninstalled event.
 * @returns The prepared event object.
 * @extension ERC721
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { hooksUninstalledEvent } from "thirdweb/extensions/erc721";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  hooksUninstalledEvent()
 * ],
 * });
 * ```
 */
export function hooksUninstalledEvent() {
  return prepareEvent({
    signature: "event HooksUninstalled(uint256 hooks)",
  });
}
