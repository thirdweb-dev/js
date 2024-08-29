import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the ModuleInstalled event.
 * @returns The prepared event object.
 * @extension MODULAR
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { moduleInstalledEvent } from "thirdweb/extensions/modular";
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
    signature:
      "event ModuleInstalled(address caller, address implementation, address installedModule)",
  });
}
