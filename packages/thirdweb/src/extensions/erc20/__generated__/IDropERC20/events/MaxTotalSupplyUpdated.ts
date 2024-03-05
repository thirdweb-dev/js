import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the MaxTotalSupplyUpdated event.
 * @returns The prepared event object.
 * @extension ERC20
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { maxTotalSupplyUpdatedEvent } from "thirdweb/extensions/erc20";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  maxTotalSupplyUpdatedEvent()
 * ],
 * });
 * ```
 */
export function maxTotalSupplyUpdatedEvent() {
  return prepareEvent({
    signature: "event MaxTotalSupplyUpdated(uint256 maxTotalSupply)",
  });
}
