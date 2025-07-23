import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the AdapterDisabled event.
 * @returns The prepared event object.
 * @extension TOKENS
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { adapterDisabledEvent } from "thirdweb/extensions/tokens";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  adapterDisabledEvent()
 * ],
 * });
 * ```
 */
export function adapterDisabledEvent() {
  return prepareEvent({
    signature: "event AdapterDisabled(uint8 adapterType)",
  });
}
