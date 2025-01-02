import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the ModuleUninstalled event.
 * @returns The prepared event object.
 * @extension MODULES
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { moduleUninstalledEvent } from "thirdweb/extensions/modules";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  moduleUninstalledEvent()
 * ],
 * });
 * ```
 */
export function moduleUninstalledEvent() {
  return prepareEvent({
    signature:
      "event ModuleUninstalled(address caller, address implementation, address installedModule)",
  });
}
