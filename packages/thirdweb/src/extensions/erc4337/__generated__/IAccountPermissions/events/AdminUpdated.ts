import type { AbiParameterToPrimitiveType } from "abitype";
import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Represents the filters for the "AdminUpdated" event.
 */
export type AdminUpdatedEventFilters = Partial<{
  signer: AbiParameterToPrimitiveType<{
    type: "address";
    name: "signer";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the AdminUpdated event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ERC4337
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { adminUpdatedEvent } from "thirdweb/extensions/erc4337";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  adminUpdatedEvent({
 *  signer: ...,
 * })
 * ],
 * });
 * ```
 */
export function adminUpdatedEvent(filters: AdminUpdatedEventFilters = {}) {
  return prepareEvent({
    filters,
    signature: "event AdminUpdated(address indexed signer, bool isAdmin)",
  });
}
