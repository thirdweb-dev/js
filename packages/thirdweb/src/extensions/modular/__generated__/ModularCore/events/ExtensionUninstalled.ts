import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the ExtensionUninstalled event.
 * @returns The prepared event object.
 * @extension MODULAR
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { extensionUninstalledEvent } from "thirdweb/extensions/modular";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  extensionUninstalledEvent()
 * ],
 * });
 * ```
 */
export function extensionUninstalledEvent() {
  return prepareEvent({
    signature:
      "event ExtensionUninstalled(address caller, address implementation, address installedExtension)",
  });
}
