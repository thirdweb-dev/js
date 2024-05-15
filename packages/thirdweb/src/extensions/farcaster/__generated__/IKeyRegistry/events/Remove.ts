import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "Remove" event.
 */
export type RemoveEventFilters = Partial<{
  fid: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "fid";
    indexed: true;
  }>;
  key: AbiParameterToPrimitiveType<{
    type: "bytes";
    name: "key";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the Remove event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { removeEvent } from "thirdweb/extensions/farcaster";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  removeEvent({
 *  fid: ...,
 *  key: ...,
 * })
 * ],
 * });
 * ```
 */
export function removeEvent(filters: RemoveEventFilters = {}) {
  return prepareEvent({
    signature:
      "event Remove(uint256 indexed fid, bytes indexed key, bytes keyBytes)",
    filters,
  });
}
