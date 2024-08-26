import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the TransferValidatorUpdated event.
 * @returns The prepared event object.
 * @extension MODULAR
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { transferValidatorUpdatedEvent } from "thirdweb/extensions/modular";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  transferValidatorUpdatedEvent()
 * ],
 * });
 * ```
 */
export function transferValidatorUpdatedEvent() {
  return prepareEvent({
    signature:
      "event TransferValidatorUpdated(address oldValidator, address newValidator)",
  });
}
