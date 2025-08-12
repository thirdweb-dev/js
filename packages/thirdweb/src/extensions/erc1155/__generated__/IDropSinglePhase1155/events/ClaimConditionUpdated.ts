import type { AbiParameterToPrimitiveType } from "abitype";
import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Represents the filters for the "ClaimConditionUpdated" event.
 */
export type ClaimConditionUpdatedEventFilters = Partial<{
  tokenId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "tokenId";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the ClaimConditionUpdated event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ERC1155
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { claimConditionUpdatedEvent } from "thirdweb/extensions/erc1155";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  claimConditionUpdatedEvent({
 *  tokenId: ...,
 * })
 * ],
 * });
 * ```
 */
export function claimConditionUpdatedEvent(
  filters: ClaimConditionUpdatedEventFilters = {},
) {
  return prepareEvent({
    filters,
    signature:
      "event ClaimConditionUpdated(uint256 indexed tokenId, (uint256 startTimestamp, uint256 maxClaimableSupply, uint256 supplyClaimed, uint256 quantityLimitPerWallet, bytes32 merkleRoot, uint256 pricePerToken, address currency, string metadata) condition, bool resetEligibility)",
  });
}
