import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the FreezeKeyGateway event.
 * @returns The prepared event object.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { freezeKeyGatewayEvent } from "thirdweb/extensions/farcaster";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  freezeKeyGatewayEvent()
 * ],
 * });
 * ```
 */
export function freezeKeyGatewayEvent() {
  return prepareEvent({
    signature: "event FreezeKeyGateway(address keyGateway)",
  });
}
