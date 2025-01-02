import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "UpdatedRewardsPerUnitTime" event.
 */
export type UpdatedRewardsPerUnitTimeEventFilters = Partial<{
  _tokenId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "_tokenId";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the UpdatedRewardsPerUnitTime event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ERC1155
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { updatedRewardsPerUnitTimeEvent } from "thirdweb/extensions/erc1155";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  updatedRewardsPerUnitTimeEvent({
 *  _tokenId: ...,
 * })
 * ],
 * });
 * ```
 */
export function updatedRewardsPerUnitTimeEvent(
  filters: UpdatedRewardsPerUnitTimeEventFilters = {},
) {
  return prepareEvent({
    signature:
      "event UpdatedRewardsPerUnitTime(uint256 indexed _tokenId, uint256 oldRewardsPerUnitTime, uint256 newRewardsPerUnitTime)",
    filters,
  });
}
