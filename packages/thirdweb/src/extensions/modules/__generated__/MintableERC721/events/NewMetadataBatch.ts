import type { AbiParameterToPrimitiveType } from "abitype";
import { prepareEvent } from "../../../../../event/prepare-event.js";

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
 * @modules MintableERC721
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { MintableERC721 } from "thirdweb/modules";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  MintableERC721.newMetadataBatchEvent({
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
    filters,
    signature:
      "event NewMetadataBatch(uint256 indexed startTokenIdInclusive, uint256 indexed endTokenIdNonInclusive, string baseURI)",
  });
}
