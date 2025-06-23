import type { AbiParameterToPrimitiveType } from "abitype";
import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Represents the filters for the "PackOpenRequested" event.
 */
export type PackOpenRequestedEventFilters = Partial<{
  opener: AbiParameterToPrimitiveType<{
    type: "address";
    name: "opener";
    indexed: true;
  }>;
  packId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "packId";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the PackOpenRequested event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension PACK
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { packOpenRequestedEvent } from "thirdweb/extensions/pack";
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
export function packOpenRequestedEvent(
  filters: PackOpenRequestedEventFilters = {},
) {
  return prepareEvent({
    filters,
    signature:
      "event PackOpenRequested(address indexed opener, uint256 indexed packId, uint256 amountToOpen, uint256 requestId)",
  });
}
