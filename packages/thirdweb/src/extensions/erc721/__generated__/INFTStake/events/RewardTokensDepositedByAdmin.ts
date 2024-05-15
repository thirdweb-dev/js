import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the RewardTokensDepositedByAdmin event.
 * @returns The prepared event object.
 * @extension ERC721
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { rewardTokensDepositedByAdminEvent } from "thirdweb/extensions/erc721";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  rewardTokensDepositedByAdminEvent()
 * ],
 * });
 * ```
 */
export function rewardTokensDepositedByAdminEvent() {
  return prepareEvent({
    signature: "event RewardTokensDepositedByAdmin(uint256 _amount)",
  });
}
