import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the SetStorageRegistry event.
 * @returns The prepared event object.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { setStorageRegistryEvent } from "thirdweb/extensions/farcaster";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  setStorageRegistryEvent()
 * ],
 * });
 * ```
 */
export function setStorageRegistryEvent() {
  return prepareEvent({
    signature:
      "event SetStorageRegistry(address oldStorageRegistry, address newStorageRegistry)",
  });
}
