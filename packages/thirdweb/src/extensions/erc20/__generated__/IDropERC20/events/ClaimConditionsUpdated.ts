import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the ClaimConditionsUpdated event.
 * @returns The prepared event object.
 * @extension ERC20
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { claimConditionsUpdatedEvent } from "thirdweb/extensions/erc20";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  claimConditionsUpdatedEvent()
 * ],
 * });
 * ```
 */
export function claimConditionsUpdatedEvent() {
  return prepareEvent({
    signature:
      "event ClaimConditionsUpdated((uint256 startTimestamp, uint256 maxClaimableSupply, uint256 supplyClaimed, uint256 quantityLimitPerWallet, bytes32 merkleRoot, uint256 pricePerToken, address currency, string metadata)[] claimConditions, bool resetEligibility)",
  });
}
