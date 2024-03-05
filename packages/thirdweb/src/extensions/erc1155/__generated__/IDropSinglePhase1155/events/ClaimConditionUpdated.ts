import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "ClaimConditionUpdated" event.
 */
export type ClaimConditionUpdatedEventFilters = Partial<{
  tokenId: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "uint256";
    name: "tokenId";
    type: "uint256";
  }>;
}>;

/**
 * Creates an event object for the ClaimConditionUpdated event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ERC1155
 * @example
 * ```
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
    signature:
      "event ClaimConditionUpdated(uint256 indexed tokenId, (uint256 startTimestamp, uint256 maxClaimableSupply, uint256 supplyClaimed, uint256 quantityLimitPerWallet, bytes32 merkleRoot, uint256 pricePerToken, address currency, string metadata) condition, bool resetEligibility)",
    filters,
  });
}
