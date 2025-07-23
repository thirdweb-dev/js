import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the ContractURIUpdated event.
 * @returns The prepared event object.
 * @extension TOKENS
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { contractURIUpdatedEvent } from "thirdweb/extensions/tokens";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  contractURIUpdatedEvent()
 * ],
 * });
 * ```
 */
export function contractURIUpdatedEvent() {
  return prepareEvent({
    signature: "event ContractURIUpdated()",
  });
}
