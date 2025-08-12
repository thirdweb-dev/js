import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the NonceUsed event.
 * @returns The prepared event object.
 * @extension TOKENS
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { nonceUsedEvent } from "thirdweb/extensions/tokens";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  nonceUsedEvent()
 * ],
 * });
 * ```
 */
export function nonceUsedEvent() {
  return prepareEvent({
    signature: "event NonceUsed(address account, uint256 nonce)",
  });
}
