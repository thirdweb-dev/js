import type { AbiParameterToPrimitiveType } from "abitype";
import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Represents the filters for the "RulesEngineOverriden" event.
 */
export type RulesEngineOverridenEventFilters = Partial<{
  newRulesEngine: AbiParameterToPrimitiveType<{
    type: "address";
    name: "newRulesEngine";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the RulesEngineOverriden event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { rulesEngineOverridenEvent } from "thirdweb/extensions/thirdweb";
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
  filters: RulesEngineOverridenEventFilters = {},
) {
  return prepareEvent({
    filters,
    signature: "event RulesEngineOverriden(address indexed newRulesEngine)",
  });
}
