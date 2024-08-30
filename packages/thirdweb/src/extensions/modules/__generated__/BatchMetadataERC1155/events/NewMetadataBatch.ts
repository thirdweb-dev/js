import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "NewMetadataBatch" event.
 */
export type NewMetadataBatchEventFilters = Partial<{
  startTokenIdInclusive: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "startTokenIdInclusive";
    indexed: true;
  }>;
  endTokenIdNonInclusive: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "endTokenIdNonInclusive";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the NewMetadataBatch event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @module BatchMetadataERC1155
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { BatchMetadataERC1155 } from "thirdweb/modules";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  BatchMetadataERC1155.newMetadataBatchEvent({
 *  startTokenIdInclusive: ...,
 *  endTokenIdNonInclusive: ...,
 * })
 * ],
 * });
 * ```
 */
export function newMetadataBatchEvent(
  filters: NewMetadataBatchEventFilters = {},
) {
  return prepareEvent({
    signature:
      "event NewMetadataBatch(uint256 indexed startTokenIdInclusive, uint256 indexed endTokenIdNonInclusive, string baseURI)",
    filters,
  });
}
