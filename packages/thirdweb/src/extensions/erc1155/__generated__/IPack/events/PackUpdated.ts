import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "PackUpdated" event.
 */
export type PackUpdatedEventFilters = Partial<{
  packId: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "uint256";
    name: "packId";
    type: "uint256";
  }>;
}>;

/**
 * Creates an event object for the PackUpdated event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ERC1155
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { packUpdatedEvent } from "thirdweb/extensions/erc1155";
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
    signature:
      "event PackUpdated(uint256 indexed packId, address recipient, uint256 totalPacksCreated)",
    filters,
  });
}
