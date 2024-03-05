import { prepareEvent } from "../../../../event/prepare-event.js";

/**
 * Creates an event object for the ContractURIUpdated event.
 * @returns The prepared event object.
 * @extension ICONTRACTMETADATA
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { contractURIUpdatedEvent } from "thirdweb/extensions/IContractMetadata";
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
    signature: "event ContractURIUpdated(string prevURI, string newURI)",
  });
}
