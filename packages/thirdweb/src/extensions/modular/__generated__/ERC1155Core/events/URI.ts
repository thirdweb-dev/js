import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "URI" event.
 */
export type URIEventFilters = Partial<{
  id: AbiParameterToPrimitiveType<{
    name: "id";
    type: "uint256";
    indexed: true;
    internalType: "uint256";
  }>;
}>;

/**
 * Creates an event object for the URI event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension MODULAR
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { uRIEvent } from "thirdweb/extensions/modular";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  uRIEvent({
 *  id: ...,
 * })
 * ],
 * });
 * ```
 */
export function uRIEvent(filters: URIEventFilters = {}) {
  return prepareEvent({
    signature: "event URI(string value, uint256 indexed id)",
    filters,
  });
}
