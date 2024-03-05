import { prepareEvent } from "../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "RuleDeleted" event.
 */
export type RuleDeletedFilters = {
  ruleId: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "bytes32";
    name: "ruleId";
    type: "bytes32";
  }>;
};

/**
 * Creates an event object for the RuleDeleted event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension IRULESENGINE
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { ruleDeletedEvent } from "thirdweb/extensions/IRulesEngine";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  ruleDeletedEvent({
 *  ruleId: ...,
 * })
 * ],
 * });
 * ```
 */
export function ruleDeletedEvent(filters: RuleDeletedFilters = {}) {
  return prepareEvent({
    signature: "event RuleDeleted(bytes32 indexed ruleId)",
    filters,
  });
}
