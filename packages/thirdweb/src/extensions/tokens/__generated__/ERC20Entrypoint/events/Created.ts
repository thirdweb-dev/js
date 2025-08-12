import type { AbiParameterToPrimitiveType } from "abitype";
import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Represents the filters for the "Created" event.
 */
export type CreatedEventFilters = Partial<{
  creator: AbiParameterToPrimitiveType<{
    type: "address";
    name: "creator";
    indexed: true;
  }>;
  asset: AbiParameterToPrimitiveType<{
    type: "address";
    name: "asset";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the Created event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension TOKENS
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { createdEvent } from "thirdweb/extensions/tokens";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  createdEvent({
 *  creator: ...,
 *  asset: ...,
 * })
 * ],
 * });
 * ```
 */
export function createdEvent(filters: CreatedEventFilters = {}) {
  return prepareEvent({
    signature:
      "event Created(bytes32 contractId, address indexed creator, address indexed asset, address developer, bytes hookData)",
    filters,
  });
}
