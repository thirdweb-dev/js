import type { AbiParameterToPrimitiveType } from "abitype";
import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Represents the filters for the "ValueReceived" event.
 */
export type ValueReceivedEventFilters = Partial<{
  user: AbiParameterToPrimitiveType<{
    type: "address";
    name: "user";
    indexed: true;
  }>;
  from: AbiParameterToPrimitiveType<{
    type: "address";
    name: "from";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the ValueReceived event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ERC7702
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { valueReceivedEvent } from "thirdweb/extensions/erc7702";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  valueReceivedEvent({
 *  user: ...,
 *  from: ...,
 * })
 * ],
 * });
 * ```
 */
export function valueReceivedEvent(filters: ValueReceivedEventFilters = {}) {
  return prepareEvent({
    signature:
      "event ValueReceived(address indexed user, address indexed from, uint256 value)",
    filters,
  });
}
