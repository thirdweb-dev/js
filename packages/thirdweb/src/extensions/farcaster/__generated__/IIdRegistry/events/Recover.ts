import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "Recover" event.
 */
export type RecoverEventFilters = Partial<{
  from: AbiParameterToPrimitiveType<{
    type: "address";
    name: "from";
    indexed: true;
  }>;
  to: AbiParameterToPrimitiveType<{
    type: "address";
    name: "to";
    indexed: true;
  }>;
  id: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "id";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the Recover event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { recoverEvent } from "thirdweb/extensions/farcaster";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  recoverEvent({
 *  from: ...,
 *  to: ...,
 *  id: ...,
 * })
 * ],
 * });
 * ```
 */
export function recoverEvent(filters: RecoverEventFilters = {}) {
  return prepareEvent({
    signature:
      "event Recover(address indexed from, address indexed to, uint256 indexed id)",
    filters,
  });
}
