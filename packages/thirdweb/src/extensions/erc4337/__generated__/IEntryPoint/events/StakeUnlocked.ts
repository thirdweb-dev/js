import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "StakeUnlocked" event.
 */
export type StakeUnlockedEventFilters = Partial<{
  account: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "account";
    type: "address";
  }>;
}>;

/**
 * Creates an event object for the StakeUnlocked event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ERC4337
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { stakeUnlockedEvent } from "thirdweb/extensions/erc4337";
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
export function stakeUnlockedEvent(filters: StakeUnlockedEventFilters = {}) {
  return prepareEvent({
    signature:
      "event StakeUnlocked(address indexed account, uint256 withdrawTime)",
    filters,
  });
}
