import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "AdminReset" event.
 */
export type AdminResetEventFilters = Partial<{
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
 * Creates an event object for the AdminReset event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension FARCASTER
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { adminResetEvent } from "thirdweb/extensions/farcaster";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  adminResetEvent({
 *  fid: ...,
 *  key: ...,
 * })
 * ],
 * });
 * ```
 */
export function adminResetEvent(filters: AdminResetEventFilters = {}) {
  return prepareEvent({
    signature:
      "event AdminReset(uint256 indexed fid, bytes indexed key, bytes keyBytes)",
    filters,
  });
}
