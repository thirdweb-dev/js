import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "DelegateVotesChanged" event.
 */
export type DelegateVotesChangedEventFilters = Partial<{
  delegate: AbiParameterToPrimitiveType<{
    type: "address";
    name: "delegate";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the DelegateVotesChanged event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ERC20
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { delegateVotesChangedEvent } from "thirdweb/extensions/erc20";
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
  filters: DelegateVotesChangedEventFilters = {},
) {
  return prepareEvent({
    signature:
      "event DelegateVotesChanged(address indexed delegate, uint256 previousBalance, uint256 newBalance)",
    filters,
  });
}
