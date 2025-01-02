import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the SetIdGateway event.
 * @returns The prepared event object.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { setIdGatewayEvent } from "thirdweb/extensions/farcaster";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  setIdGatewayEvent()
 * ],
 * });
 * ```
 */
export function setIdGatewayEvent() {
  return prepareEvent({
    signature: "event SetIdGateway(address oldIdGateway, address newIdGateway)",
  });
}
