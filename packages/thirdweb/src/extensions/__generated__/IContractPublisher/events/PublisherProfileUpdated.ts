import { prepareEvent } from "../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "PublisherProfileUpdated" event.
 */
export type PublisherProfileUpdatedFilters = {
  publisher: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "publisher";
    type: "address";
  }>;
};

/**
 * Creates an event object for the PublisherProfileUpdated event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ICONTRACTPUBLISHER
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { publisherProfileUpdatedEvent } from "thirdweb/extensions/IContractPublisher";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  publisherProfileUpdatedEvent({
 *  publisher: ...,
 * })
 * ],
 * });
 * ```
 */
export function publisherProfileUpdatedEvent(
  filters: PublisherProfileUpdatedFilters = {},
) {
  return prepareEvent({
    signature:
      "event PublisherProfileUpdated(address indexed publisher, string prevURI, string newURI)",
    filters,
  });
}
