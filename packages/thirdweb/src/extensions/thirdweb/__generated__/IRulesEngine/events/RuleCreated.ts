import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "RuleCreated" event.
 */
export type RuleCreatedEventFilters = Partial<{
  ruleId: AbiParameterToPrimitiveType<{
    type: "bytes32";
    name: "ruleId";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the RuleCreated event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { ruleCreatedEvent } from "thirdweb/extensions/thirdweb";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  ruleCreatedEvent({
 *  ruleId: ...,
 * })
 * ],
 * });
 * ```
 */
export function ruleCreatedEvent(filters: RuleCreatedEventFilters = {}) {
  return prepareEvent({
    signature:
      "event RuleCreated(bytes32 indexed ruleId, (bytes32 ruleId, address token, uint8 tokenType, uint256 tokenId, uint256 balance, uint256 score, uint8 ruleType) rule)",
    filters,
  });
}
