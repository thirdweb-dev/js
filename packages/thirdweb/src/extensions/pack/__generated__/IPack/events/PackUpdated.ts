import type { AbiParameterToPrimitiveType } from "abitype";
import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Represents the filters for the "PackUpdated" event.
 */
export type PackUpdatedEventFilters = Partial<{
  packId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "packId";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the PackUpdated event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension PACK
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { packUpdatedEvent } from "thirdweb/extensions/pack";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  packUpdatedEvent({
 *  packId: ...,
 * })
 * ],
 * });
 * ```
 */
export function packUpdatedEvent(filters: PackUpdatedEventFilters = {}) {
  return prepareEvent({
    filters,
    signature:
      "event PackUpdated(uint256 indexed packId, address recipient, uint256 totalPacksCreated)",
  });
}
