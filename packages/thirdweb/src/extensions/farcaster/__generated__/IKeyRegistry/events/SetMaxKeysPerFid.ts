import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the SetMaxKeysPerFid event.
 * @returns The prepared event object.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { setMaxKeysPerFidEvent } from "thirdweb/extensions/farcaster";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  setMaxKeysPerFidEvent()
 * ],
 * });
 * ```
 */
export function setMaxKeysPerFidEvent() {
  return prepareEvent({
    signature: "event SetMaxKeysPerFid(uint256 oldMax, uint256 newMax)",
  });
}
