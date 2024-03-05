import { prepareEvent } from "../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "Withdrawn" event.
 */
export type WithdrawnFilters = {
  account: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "account";
    type: "address";
  }>;
};

/**
 * Creates an event object for the Withdrawn event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ISTAKEMANAGER
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { withdrawnEvent } from "thirdweb/extensions/IStakeManager";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  withdrawnEvent({
 *  account: ...,
 * })
 * ],
 * });
 * ```
 */
export function withdrawnEvent(filters: WithdrawnFilters = {}) {
  return prepareEvent({
    signature:
      "event Withdrawn(address indexed account, address withdrawAddress, uint256 amount)",
    filters,
  });
}
