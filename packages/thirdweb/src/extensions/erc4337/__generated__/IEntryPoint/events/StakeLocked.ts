import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "StakeLocked" event.
 */
export type StakeLockedEventFilters = Partial<{
  account: AbiParameterToPrimitiveType<{
    type: "address";
    name: "account";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the StakeLocked event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ERC4337
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { stakeLockedEvent } from "thirdweb/extensions/erc4337";
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
export function stakeLockedEvent(filters: StakeLockedEventFilters = {}) {
  return prepareEvent({
    signature:
      "event StakeLocked(address indexed account, uint256 totalStaked, uint256 unstakeDelaySec)",
    filters,
  });
}
