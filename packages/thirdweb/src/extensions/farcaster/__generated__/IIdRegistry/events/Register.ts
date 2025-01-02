import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "Register" event.
 */
export type RegisterEventFilters = Partial<{
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
 * Creates an event object for the Register event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { registerEvent } from "thirdweb/extensions/farcaster";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  registerEvent({
 *  to: ...,
 *  id: ...,
 * })
 * ],
 * });
 * ```
 */
export function registerEvent(filters: RegisterEventFilters = {}) {
  return prepareEvent({
    signature:
      "event Register(address indexed to, uint256 indexed id, address recovery)",
    filters,
  });
}
