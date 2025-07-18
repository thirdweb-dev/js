import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "Add" event.
 */
export type AddEventFilters = Partial<{
  fid: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "fid";
    indexed: true;
  }>;
  keyType: AbiParameterToPrimitiveType<{
    type: "uint32";
    name: "keyType";
    indexed: true;
  }>;
  key: AbiParameterToPrimitiveType<{
    type: "bytes";
    name: "key";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the Add event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { addEvent } from "thirdweb/extensions/farcaster";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  addEvent({
 *  fid: ...,
 *  keyType: ...,
 *  key: ...,
 * })
 * ],
 * });
 * ```
 */
export function addEvent(filters: AddEventFilters = {}) {
  return prepareEvent({
    signature:
      "event Add(uint256 indexed fid, uint32 indexed keyType, bytes indexed key, bytes keyBytes, uint8 metadataType, bytes metadata)",
    filters,
  });
}
