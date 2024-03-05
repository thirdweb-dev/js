import { prepareEvent } from "../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "RequestExecuted" event.
 */
export type RequestExecutedFilters = {
  user: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "user";
    type: "address";
  }>;
  signer: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "signer";
    type: "address";
  }>;
};

/**
 * Creates an event object for the RequestExecuted event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ISIGNATUREACTION
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { requestExecutedEvent } from "thirdweb/extensions/ISignatureAction";
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
export function requestExecutedEvent(filters: RequestExecutedFilters = {}) {
  return prepareEvent({
    signature:
      "event RequestExecuted(address indexed user, address indexed signer, (uint128 validityStartTimestamp, uint128 validityEndTimestamp, bytes32 uid, bytes data) _req)",
    filters,
  });
}
