import type { AbiParameterToPrimitiveType } from "abitype";
import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Represents the filters for the "Upgraded" event.
 */
export type UpgradedEventFilters = Partial<{
  implementation: AbiParameterToPrimitiveType<{
    type: "address";
    name: "implementation";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the Upgraded event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ERC7579
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { upgradedEvent } from "thirdweb/extensions/erc7579";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  upgradedEvent({
 *  implementation: ...,
 * })
 * ],
 * });
 * ```
 */
export function upgradedEvent(filters: UpgradedEventFilters = {}) {
  return prepareEvent({
    filters,
    signature: "event Upgraded(address indexed implementation)",
  });
}
