import { prepareEvent } from "../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "URI" event.
 */
export type URIFilters = {
  id: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "uint256";
    name: "id";
    type: "uint256";
  }>;
};

/**
 * Creates an event object for the URI event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ITOKENERC1155
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { uRIEvent } from "thirdweb/extensions/ITokenERC1155";
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
export function uRIEvent(filters: URIFilters = {}) {
  return prepareEvent({
    signature: "event URI(string value, uint256 indexed id)",
    filters,
  });
}
