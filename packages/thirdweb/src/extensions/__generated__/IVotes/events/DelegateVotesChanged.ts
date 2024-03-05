import { prepareEvent } from "../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "DelegateVotesChanged" event.
 */
export type DelegateVotesChangedFilters = {
  delegate: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "delegate";
    type: "address";
  }>;
};

/**
 * Creates an event object for the DelegateVotesChanged event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension IVOTES
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { delegateVotesChangedEvent } from "thirdweb/extensions/IVotes";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  delegateVotesChangedEvent({
 *  delegate: ...,
 * })
 * ],
 * });
 * ```
 */
export function delegateVotesChangedEvent(
  filters: DelegateVotesChangedFilters = {},
) {
  return prepareEvent({
    signature:
      "event DelegateVotesChanged(address indexed delegate, uint256 previousBalance, uint256 newBalance)",
    filters,
  });
}
