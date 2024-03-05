import { prepareEvent } from "../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "SharedMetadataUpdated" event.
 */
export type SharedMetadataUpdatedFilters = {
  id: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "bytes32";
    name: "id";
    type: "bytes32";
  }>;
};

/**
 * Creates an event object for the SharedMetadataUpdated event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ISHAREDMETADATABATCH
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { sharedMetadataUpdatedEvent } from "thirdweb/extensions/ISharedMetadataBatch";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  sharedMetadataUpdatedEvent({
 *  id: ...,
 * })
 * ],
 * });
 * ```
 */
export function sharedMetadataUpdatedEvent(
  filters: SharedMetadataUpdatedFilters = {},
) {
  return prepareEvent({
    signature:
      "event SharedMetadataUpdated(bytes32 indexed id, string name, string description, string imageURI, string animationURI)",
    filters,
  });
}
