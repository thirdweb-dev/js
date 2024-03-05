import { prepareEvent } from "../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "StakeLocked" event.
 */
export type StakeLockedFilters = {
  account: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "account";
    type: "address";
  }>;
};

/**
 * Creates an event object for the StakeLocked event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ISTAKEMANAGER
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { stakeLockedEvent } from "thirdweb/extensions/IStakeManager";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  stakeLockedEvent({
 *  account: ...,
 * })
 * ],
 * });
 * ```
 */
export function stakeLockedEvent(filters: StakeLockedFilters = {}) {
  return prepareEvent({
    signature:
      "event StakeLocked(address indexed account, uint256 totalStaked, uint256 unstakeDelaySec)",
    filters,
  });
}
