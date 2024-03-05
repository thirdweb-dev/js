import { prepareEvent } from "../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "StakeWithdrawn" event.
 */
export type StakeWithdrawnFilters = {
  account: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "account";
    type: "address";
  }>;
};

/**
 * Creates an event object for the StakeWithdrawn event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ISTAKEMANAGER
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { stakeWithdrawnEvent } from "thirdweb/extensions/IStakeManager";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  stakeWithdrawnEvent({
 *  account: ...,
 * })
 * ],
 * });
 * ```
 */
export function stakeWithdrawnEvent(filters: StakeWithdrawnFilters = {}) {
  return prepareEvent({
    signature:
      "event StakeWithdrawn(address indexed account, address withdrawAddress, uint256 amount)",
    filters,
  });
}
