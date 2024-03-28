import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the SetValidator event.
 * @returns The prepared event object.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { setValidatorEvent } from "thirdweb/extensions/farcaster";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  setValidatorEvent()
 * ],
 * });
 * ```
 */
export function setValidatorEvent() {
  return prepareEvent({
    signature:
      "event SetValidator(uint32 keyType, uint8 metadataType, address oldValidator, address newValidator)",
  });
}
