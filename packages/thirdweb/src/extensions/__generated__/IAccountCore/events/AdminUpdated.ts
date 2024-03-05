import { prepareEvent } from "../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "AdminUpdated" event.
 */
export type AdminUpdatedFilters = {
  signer: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "signer";
    type: "address";
  }>;
};

/**
 * Creates an event object for the AdminUpdated event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension IACCOUNTCORE
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { adminUpdatedEvent } from "thirdweb/extensions/IAccountCore";
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
export function adminUpdatedEvent(filters: AdminUpdatedFilters = {}) {
  return prepareEvent({
    signature: "event AdminUpdated(address indexed signer, bool isAdmin)",
    filters,
  });
}
