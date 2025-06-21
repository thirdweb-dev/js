import type { AbiParameterToPrimitiveType } from "abitype";
import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Represents the filters for the "PackOpened" event.
 */
export type PackOpenedEventFilters = Partial<{
  packId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "packId";
    indexed: true;
  }>;
  opener: AbiParameterToPrimitiveType<{
    type: "address";
    name: "opener";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the PackOpened event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension PACK
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { packOpenedEvent } from "thirdweb/extensions/pack";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  packOpenedEvent({
 *  packId: ...,
 *  opener: ...,
 * })
 * ],
 * });
 * ```
 */
export function packOpenedEvent(filters: PackOpenedEventFilters = {}) {
  return prepareEvent({
    filters,
    signature:
      "event PackOpened(uint256 indexed packId, address indexed opener, uint256 numOfPacksOpened, (address assetContract, uint8 tokenType, uint256 tokenId, uint256 totalAmount)[] rewardUnitsDistributed)",
  });
}
