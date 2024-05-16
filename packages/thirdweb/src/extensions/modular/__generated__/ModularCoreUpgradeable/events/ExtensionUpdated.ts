import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the ExtensionUpdated event.
 * @returns The prepared event object.
 * @extension MODULAR
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { extensionUpdatedEvent } from "thirdweb/extensions/modular";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  extensionUpdatedEvent()
 * ],
 * });
 * ```
 */
export function extensionUpdatedEvent() {
  return prepareEvent({
    signature:
      "event ExtensionUpdated(address sender, address oldExtensionImplementation, address newExtensionImplementation, address extensionProxy)",
  });
}
