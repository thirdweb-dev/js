import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the ExtensionInstalled event.
 * @returns The prepared event object.
 * @extension MODULAR
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { extensionInstalledEvent } from "thirdweb/extensions/modular";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  extensionInstalledEvent()
 * ],
 * });
 * ```
 */
export function extensionInstalledEvent() {
  return prepareEvent({
    signature:
      "event ExtensionInstalled(address caller, address implementation, address installedExtension)",
  });
}
