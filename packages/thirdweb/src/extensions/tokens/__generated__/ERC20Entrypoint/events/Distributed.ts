import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the Distributed event.
 * @returns The prepared event object.
 * @extension TOKENS
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { distributedEvent } from "thirdweb/extensions/tokens";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  distributedEvent()
 * ],
 * });
 * ```
 */
export function distributedEvent() {
  return prepareEvent({
    signature:
      "event Distributed(address asset, uint256 recipientCount, uint256 totalAmount)",
  });
}
