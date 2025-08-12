import type { AbiParameterToPrimitiveType } from "abitype";
import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Represents the filters for the "PublisherProfileUpdated" event.
 */
export type PublisherProfileUpdatedEventFilters = Partial<{
  publisher: AbiParameterToPrimitiveType<{
    type: "address";
    name: "publisher";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the PublisherProfileUpdated event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { publisherProfileUpdatedEvent } from "thirdweb/extensions/thirdweb";
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
  filters: PublisherProfileUpdatedEventFilters = {},
) {
  return prepareEvent({
    filters,
    signature:
      "event PublisherProfileUpdated(address indexed publisher, string prevURI, string newURI)",
  });
}
