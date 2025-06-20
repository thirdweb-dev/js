import type { AbiParameterToPrimitiveType } from "abitype";
import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Represents the filters for the "Executed" event.
 */
export type ExecutedEventFilters = Partial<{
  to: AbiParameterToPrimitiveType<{
    type: "address";
    name: "to";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the Executed event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ERC7702
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { executedEvent } from "thirdweb/extensions/erc7702";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  executedEvent({
 *  to: ...,
 * })
 * ],
 * });
 * ```
 */
export function executedEvent(filters: ExecutedEventFilters = {}) {
  return prepareEvent({
    filters,
    signature: "event Executed(address indexed to, uint256 value, bytes data)",
  });
}
