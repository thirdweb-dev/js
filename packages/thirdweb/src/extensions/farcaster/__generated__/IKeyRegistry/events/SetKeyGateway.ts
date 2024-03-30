import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the SetKeyGateway event.
 * @returns The prepared event object.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { setKeyGatewayEvent } from "thirdweb/extensions/farcaster";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  setKeyGatewayEvent()
 * ],
 * });
 * ```
 */
export function setKeyGatewayEvent() {
  return prepareEvent({
    signature:
      "event SetKeyGateway(address oldKeyGateway, address newKeyGateway)",
  });
}
