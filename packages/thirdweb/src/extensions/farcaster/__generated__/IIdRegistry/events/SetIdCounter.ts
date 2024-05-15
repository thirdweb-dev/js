import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the SetIdCounter event.
 * @returns The prepared event object.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { setIdCounterEvent } from "thirdweb/extensions/farcaster";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  setIdCounterEvent()
 * ],
 * });
 * ```
 */
export function setIdCounterEvent() {
  return prepareEvent({
    signature: "event SetIdCounter(uint256 oldCounter, uint256 newCounter)",
  });
}
