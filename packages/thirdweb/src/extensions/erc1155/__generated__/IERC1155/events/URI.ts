import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "URI" event.
 */
export type URIEventFilters = Partial<{
  _id: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "uint256";
    name: "_id";
    type: "uint256";
  }>;
}>;

/**
 * Creates an event object for the URI event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ERC1155
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { uRIEvent } from "thirdweb/extensions/erc1155";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  uRIEvent({
 *  _id: ...,
 * })
 * ],
 * });
 * ```
 */
export function uRIEvent(filters: URIEventFilters = {}) {
  return prepareEvent({
    signature: "event URI(string _value, uint256 indexed _id)",
    filters,
  });
}
