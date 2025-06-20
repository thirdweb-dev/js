import type { AbiParameterToPrimitiveType } from "abitype";
import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Represents the filters for the "SharedMetadataDeleted" event.
 */
export type SharedMetadataDeletedEventFilters = Partial<{
  id: AbiParameterToPrimitiveType<{
    type: "bytes32";
    name: "id";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the SharedMetadataDeleted event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ERC721
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { sharedMetadataDeletedEvent } from "thirdweb/extensions/erc721";
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
  filters: SharedMetadataDeletedEventFilters = {},
) {
  return prepareEvent({
    filters,
    signature: "event SharedMetadataDeleted(bytes32 indexed id)",
  });
}
