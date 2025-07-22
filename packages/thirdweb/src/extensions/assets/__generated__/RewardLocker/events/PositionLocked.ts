import type { AbiParameterToPrimitiveType } from "abitype";
import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Represents the filters for the "PositionLocked" event.
 */
export type PositionLockedEventFilters = Partial<{
  owner: AbiParameterToPrimitiveType<{
    type: "address";
    name: "owner";
    indexed: true;
  }>;
  asset: AbiParameterToPrimitiveType<{
    type: "address";
    name: "asset";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the PositionLocked event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ASSETS
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { positionLockedEvent } from "thirdweb/extensions/assets";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  positionLockedEvent({
 *  owner: ...,
 *  asset: ...,
 * })
 * ],
 * });
 * ```
 */
export function positionLockedEvent(filters: PositionLockedEventFilters = {}) {
  return prepareEvent({
    signature:
      "event PositionLocked(address indexed owner, address indexed asset, address positionManager, uint256 tokenId, address recipient, address referrer)",
    filters,
  });
}
