import { prepareEvent } from "../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "UpdatedRewardsPerUnitTime" event.
 */
export type UpdatedRewardsPerUnitTimeFilters = {
  tokenId: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "uint256";
    name: "_tokenId";
    type: "uint256";
  }>;
};

/**
 * Creates an event object for the UpdatedRewardsPerUnitTime event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ISTAKING1155
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { updatedRewardsPerUnitTimeEvent } from "thirdweb/extensions/IStaking1155";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  updatedRewardsPerUnitTimeEvent({
 *  tokenId: ...,
 * })
 * ],
 * });
 * ```
 */
export function updatedRewardsPerUnitTimeEvent(
  filters: UpdatedRewardsPerUnitTimeFilters = {},
) {
  return prepareEvent({
    signature:
      "event UpdatedRewardsPerUnitTime(uint256 indexed _tokenId, uint256 oldRewardsPerUnitTime, uint256 newRewardsPerUnitTime)",
    filters,
  });
}
