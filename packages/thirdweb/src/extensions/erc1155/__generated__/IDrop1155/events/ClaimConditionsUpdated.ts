import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "ClaimConditionsUpdated" event.
 */
export type ClaimConditionsUpdatedEventFilters = Partial<{
  tokenId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "tokenId";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the ClaimConditionsUpdated event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ERC1155
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { claimConditionsUpdatedEvent } from "thirdweb/extensions/erc1155";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  claimConditionsUpdatedEvent({
 *  tokenId: ...,
 * })
 * ],
 * });
 * ```
 */
export function claimConditionsUpdatedEvent(
  filters: ClaimConditionsUpdatedEventFilters = {},
) {
  return prepareEvent({
    signature:
      "event ClaimConditionsUpdated(uint256 indexed tokenId, (uint256 startTimestamp, uint256 maxClaimableSupply, uint256 supplyClaimed, uint256 quantityLimitPerWallet, bytes32 merkleRoot, uint256 pricePerToken, address currency, string metadata)[] claimConditions, bool resetEligibility)",
    filters,
  });
}
