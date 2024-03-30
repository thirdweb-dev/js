import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "PackCreated" event.
 */
export type PackCreatedEventFilters = Partial<{
  packId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "packId";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the PackCreated event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ERC1155
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { packCreatedEvent } from "thirdweb/extensions/erc1155";
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
export function packCreatedEvent(filters: PackCreatedEventFilters = {}) {
  return prepareEvent({
    signature:
      "event PackCreated(uint256 indexed packId, address recipient, uint256 totalPacksCreated)",
    filters,
  });
}
