import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "UpdatedTimeUnit" event.
 */
export type UpdatedTimeUnitEventFilters = Partial<{
  _tokenId: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "uint256";
    name: "_tokenId";
    type: "uint256";
  }>;
}>;

/**
 * Creates an event object for the UpdatedTimeUnit event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ERC1155
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { updatedTimeUnitEvent } from "thirdweb/extensions/erc1155";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  updatedTimeUnitEvent({
 *  _tokenId: ...,
 * })
 * ],
 * });
 * ```
 */
export function updatedTimeUnitEvent(
  filters: UpdatedTimeUnitEventFilters = {},
) {
  return prepareEvent({
    signature:
      "event UpdatedTimeUnit(uint256 indexed _tokenId, uint256 oldTimeUnit, uint256 newTimeUnit)",
    filters,
  });
}
