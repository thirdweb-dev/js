import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the UpdatedMinStakeAmount event.
 * @returns The prepared event object.
 * @extension ERC20
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { updatedMinStakeAmountEvent } from "thirdweb/extensions/erc20";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  updatedMinStakeAmountEvent()
 * ],
 * });
 * ```
 */
export function updatedMinStakeAmountEvent() {
  return prepareEvent({
    signature:
      "event UpdatedMinStakeAmount(uint256 oldAmount, uint256 newAmount)",
  });
}
