import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the FreezeIdGateway event.
 * @returns The prepared event object.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { freezeIdGatewayEvent } from "thirdweb/extensions/farcaster";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  freezeIdGatewayEvent()
 * ],
 * });
 * ```
 */
export function freezeIdGatewayEvent() {
  return prepareEvent({
    signature: "event FreezeIdGateway(address idGateway)",
  });
}
