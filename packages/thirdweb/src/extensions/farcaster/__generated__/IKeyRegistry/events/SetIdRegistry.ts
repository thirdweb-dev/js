import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the SetIdRegistry event.
 * @returns The prepared event object.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { setIdRegistryEvent } from "thirdweb/extensions/farcaster";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  setIdRegistryEvent()
 * ],
 * });
 * ```
 */
export function setIdRegistryEvent() {
  return prepareEvent({
    signature:
      "event SetIdRegistry(address oldIdRegistry, address newIdRegistry)",
  });
}
