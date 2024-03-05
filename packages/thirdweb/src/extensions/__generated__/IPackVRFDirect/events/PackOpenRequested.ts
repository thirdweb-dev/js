import { prepareEvent } from "../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "PackOpenRequested" event.
 */
export type PackOpenRequestedFilters = {
  opener: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "opener";
    type: "address";
  }>;
  packId: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "uint256";
    name: "packId";
    type: "uint256";
  }>;
};

/**
 * Creates an event object for the PackOpenRequested event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension IPACKVRFDIRECT
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { packOpenRequestedEvent } from "thirdweb/extensions/IPackVRFDirect";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  packOpenRequestedEvent({
 *  opener: ...,
 *  packId: ...,
 * })
 * ],
 * });
 * ```
 */
export function packOpenRequestedEvent(filters: PackOpenRequestedFilters = {}) {
  return prepareEvent({
    signature:
      "event PackOpenRequested(address indexed opener, uint256 indexed packId, uint256 amountToOpen, uint256 requestId)",
    filters,
  });
}
