import { prepareEvent } from "../../../../event/prepare-event.js";

/**
 * Creates an event object for the ClaimConditionsUpdated event.
 * @returns The prepared event object.
 * @extension IDROPERC20_V2
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { claimConditionsUpdatedEvent } from "thirdweb/extensions/IDropERC20_V2";
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
      "event ClaimConditionsUpdated((uint256 startTimestamp, uint256 maxClaimableSupply, uint256 supplyClaimed, uint256 quantityLimitPerTransaction, uint256 waitTimeInSecondsBetweenClaims, bytes32 merkleRoot, uint256 pricePerToken, address currency)[] claimConditions)",
  });
}
