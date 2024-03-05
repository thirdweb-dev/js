import { prepareEvent } from "../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "DelegateChanged" event.
 */
export type DelegateChangedFilters = {
  delegator: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "delegator";
    type: "address";
  }>;
  fromDelegate: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "fromDelegate";
    type: "address";
  }>;
  toDelegate: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "toDelegate";
    type: "address";
  }>;
};

/**
 * Creates an event object for the DelegateChanged event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension IVOTES
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { delegateChangedEvent } from "thirdweb/extensions/IVotes";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  delegateChangedEvent({
 *  delegator: ...,
 *  fromDelegate: ...,
 *  toDelegate: ...,
 * })
 * ],
 * });
 * ```
 */
export function delegateChangedEvent(filters: DelegateChangedFilters = {}) {
  return prepareEvent({
    signature:
      "event DelegateChanged(address indexed delegator, address indexed fromDelegate, address indexed toDelegate)",
    filters,
  });
}
