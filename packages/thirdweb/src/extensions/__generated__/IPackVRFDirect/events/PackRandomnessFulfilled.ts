import { prepareEvent } from "../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "PackRandomnessFulfilled" event.
 */
export type PackRandomnessFulfilledFilters = {
  packId: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "uint256";
    name: "packId";
    type: "uint256";
  }>;
  requestId: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "uint256";
    name: "requestId";
    type: "uint256";
  }>;
};

/**
 * Creates an event object for the PackRandomnessFulfilled event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension IPACKVRFDIRECT
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { packRandomnessFulfilledEvent } from "thirdweb/extensions/IPackVRFDirect";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  packRandomnessFulfilledEvent({
 *  packId: ...,
 *  requestId: ...,
 * })
 * ],
 * });
 * ```
 */
export function packRandomnessFulfilledEvent(
  filters: PackRandomnessFulfilledFilters = {},
) {
  return prepareEvent({
    signature:
      "event PackRandomnessFulfilled(uint256 indexed packId, uint256 indexed requestId)",
    filters,
  });
}
