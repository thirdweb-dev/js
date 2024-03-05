import { prepareEvent } from "../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "PackCreated" event.
 */
export type PackCreatedFilters = {
  packId: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "uint256";
    name: "packId";
    type: "uint256";
  }>;
};

/**
 * Creates an event object for the PackCreated event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension IPACK
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { packCreatedEvent } from "thirdweb/extensions/IPack";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  packCreatedEvent({
 *  packId: ...,
 * })
 * ],
 * });
 * ```
 */
export function packCreatedEvent(filters: PackCreatedFilters = {}) {
  return prepareEvent({
    signature:
      "event PackCreated(uint256 indexed packId, address recipient, uint256 totalPacksCreated)",
    filters,
  });
}
