import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the RewardTokensWithdrawnByAdmin event.
 * @returns The prepared event object.
 * @extension ERC721
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { rewardTokensWithdrawnByAdminEvent } from "thirdweb/extensions/erc721";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  rewardTokensWithdrawnByAdminEvent()
 * ],
 * });
 * ```
 */
export function rewardTokensWithdrawnByAdminEvent() {
  return prepareEvent({
    signature: "event RewardTokensWithdrawnByAdmin(uint256 _amount)",
  });
}
