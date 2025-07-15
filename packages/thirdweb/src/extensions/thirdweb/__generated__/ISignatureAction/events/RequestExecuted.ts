import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "RequestExecuted" event.
 */
export type RequestExecutedEventFilters = Partial<{
  user: AbiParameterToPrimitiveType<{
    type: "address";
    name: "user";
    indexed: true;
  }>;
  signer: AbiParameterToPrimitiveType<{
    type: "address";
    name: "signer";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the RequestExecuted event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { requestExecutedEvent } from "thirdweb/extensions/thirdweb";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  requestExecutedEvent({
 *  user: ...,
 *  signer: ...,
 * })
 * ],
 * });
 * ```
 */
export function requestExecutedEvent(
  filters: RequestExecutedEventFilters = {},
) {
  return prepareEvent({
    signature:
      "event RequestExecuted(address indexed user, address indexed signer, (uint128 validityStartTimestamp, uint128 validityEndTimestamp, bytes32 uid, bytes data) _req)",
    filters,
  });
}
