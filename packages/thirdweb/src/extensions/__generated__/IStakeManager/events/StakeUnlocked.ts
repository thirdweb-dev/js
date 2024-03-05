import { prepareEvent } from "../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "StakeUnlocked" event.
 */
export type StakeUnlockedFilters = {
  account: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "account";
    type: "address";
  }>;
};

/**
 * Creates an event object for the StakeUnlocked event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ISTAKEMANAGER
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { stakeUnlockedEvent } from "thirdweb/extensions/IStakeManager";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  stakeUnlockedEvent({
 *  account: ...,
 * })
 * ],
 * });
 * ```
 */
export function stakeUnlockedEvent(filters: StakeUnlockedFilters = {}) {
  return prepareEvent({
    signature:
      "event StakeUnlocked(address indexed account, uint256 withdrawTime)",
    filters,
  });
}
