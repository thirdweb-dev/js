import type { AbiParameterToPrimitiveType } from "abitype";
import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Represents the filters for the "SessionCreated" event.
 */
export type SessionCreatedEventFilters = Partial<{
  signer: AbiParameterToPrimitiveType<{
    type: "address";
    name: "signer";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the SessionCreated event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ERC7702
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { sessionCreatedEvent } from "thirdweb/extensions/erc7702";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  sessionCreatedEvent({
 *  signer: ...,
 * })
 * ],
 * });
 * ```
 */
export function sessionCreatedEvent(filters: SessionCreatedEventFilters = {}) {
  return prepareEvent({
    filters,
    signature:
      "event SessionCreated(address indexed signer, (address signer, bool isWildcard, uint256 expiresAt, (address target, bytes4 selector, uint256 maxValuePerUse, (uint8 limitType, uint256 limit, uint256 period) valueLimit, (uint8 condition, uint64 index, bytes32 refValue, (uint8 limitType, uint256 limit, uint256 period) limit)[] constraints)[] callPolicies, (address target, uint256 maxValuePerUse, (uint8 limitType, uint256 limit, uint256 period) valueLimit)[] transferPolicies, bytes32 uid) sessionSpec)",
  });
}
