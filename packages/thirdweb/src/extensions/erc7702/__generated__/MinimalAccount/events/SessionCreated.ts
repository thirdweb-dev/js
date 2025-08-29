import type { AbiParameterToPrimitiveType } from "abitype";
import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Represents the filters for the "SessionCreated" event.
 */
export type SessionCreatedEventFilters = Partial<{
  user: AbiParameterToPrimitiveType<{
    type: "address";
    name: "user";
    indexed: true;
  }>;
  newSigner: AbiParameterToPrimitiveType<{
    type: "address";
    name: "newSigner";
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
 *  user: ...,
 *  newSigner: ...,
 * })
 * ],
 * });
 * ```
 */
export function sessionCreatedEvent(filters: SessionCreatedEventFilters = {}) {
  return prepareEvent({
    signature:
      "event SessionCreated(address indexed user, address indexed newSigner, (address signer, bool isWildcard, uint256 expiresAt, (address target, bytes4 selector, uint256 maxValuePerUse, (uint8 limitType, uint256 limit, uint256 period) valueLimit, (uint8 condition, uint64 index, bytes32 refValue, (uint8 limitType, uint256 limit, uint256 period) limit)[] constraints)[] callPolicies, (address target, uint256 maxValuePerUse, (uint8 limitType, uint256 limit, uint256 period) valueLimit)[] transferPolicies, bytes32 uid) sessionSpec)",
    filters,
  });
}
