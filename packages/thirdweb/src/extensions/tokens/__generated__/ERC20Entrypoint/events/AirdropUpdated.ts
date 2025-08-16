import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the AirdropUpdated event.
 * @returns The prepared event object.
 * @extension TOKENS
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { airdropUpdatedEvent } from "thirdweb/extensions/tokens";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  airdropUpdatedEvent()
 * ],
 * });
 * ```
 */
export function airdropUpdatedEvent() {
  return prepareEvent({
    signature: "event AirdropUpdated(address airdrop)",
  });
}
