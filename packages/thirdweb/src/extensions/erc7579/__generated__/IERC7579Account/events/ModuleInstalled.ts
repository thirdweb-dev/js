import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the ModuleInstalled event.
 * @returns The prepared event object.
 * @extension ERC7579
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { moduleInstalledEvent } from "thirdweb/extensions/erc7579";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  moduleInstalledEvent()
 * ],
 * });
 * ```
 */
export function moduleInstalledEvent() {
  return prepareEvent({
    signature: "event ModuleInstalled(uint256 moduleTypeId, address module)",
  });
}
