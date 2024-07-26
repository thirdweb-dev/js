import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "NewMetadataBatch" event.
 */
export type NewMetadataBatchEventFilters = Partial<{
  startTokenIdInclusive: AbiParameterToPrimitiveType<{
    name: "startTokenIdInclusive";
    type: "uint256";
    indexed: true;
    internalType: "uint256";
  }>;
  endTokenIdNonInclusive: AbiParameterToPrimitiveType<{
    name: "endTokenIdNonInclusive";
    type: "uint256";
    indexed: true;
    internalType: "uint256";
  }>;
}>;

/**
 * Creates an event object for the NewMetadataBatch event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension MODULAR
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { newMetadataBatchEvent } from "thirdweb/extensions/modular";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  newMetadataBatchEvent({
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
