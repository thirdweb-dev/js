import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

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
 * @extension ERC1155
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { packOpenRequestedEvent } from "thirdweb/extensions/erc1155";
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
    signature:
      "event PackOpenRequested(address indexed opener, uint256 indexed packId, uint256 amountToOpen, uint256 requestId)",
    filters,
  });
}
