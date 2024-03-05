import { prepareEvent } from "../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "SharedMetadataDeleted" event.
 */
export type SharedMetadataDeletedFilters = {
  id: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "bytes32";
    name: "id";
    type: "bytes32";
  }>;
};

/**
 * Creates an event object for the SharedMetadataDeleted event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ISHAREDMETADATABATCH
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { sharedMetadataDeletedEvent } from "thirdweb/extensions/ISharedMetadataBatch";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  sharedMetadataDeletedEvent({
 *  id: ...,
 * })
 * ],
 * });
 * ```
 */
export function sharedMetadataDeletedEvent(
  filters: SharedMetadataDeletedFilters = {},
) {
  return prepareEvent({
    signature: "event SharedMetadataDeleted(bytes32 indexed id)",
    filters,
  });
}
