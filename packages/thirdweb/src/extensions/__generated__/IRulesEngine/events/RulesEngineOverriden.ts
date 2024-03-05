import { prepareEvent } from "../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "RulesEngineOverriden" event.
 */
export type RulesEngineOverridenFilters = {
  newRulesEngine: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "newRulesEngine";
    type: "address";
  }>;
};

/**
 * Creates an event object for the RulesEngineOverriden event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension IRULESENGINE
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { rulesEngineOverridenEvent } from "thirdweb/extensions/IRulesEngine";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  rulesEngineOverridenEvent({
 *  newRulesEngine: ...,
 * })
 * ],
 * });
 * ```
 */
export function rulesEngineOverridenEvent(
  filters: RulesEngineOverridenFilters = {},
) {
  return prepareEvent({
    signature: "event RulesEngineOverriden(address indexed newRulesEngine)",
    filters,
  });
}
