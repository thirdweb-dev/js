import type { AbiParameterToPrimitiveType } from "abitype";
import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Represents the filters for the "ImplementationAdded" event.
 */
export type ImplementationAddedEventFilters = Partial<{
  implementation: AbiParameterToPrimitiveType<{
    type: "address";
    name: "implementation";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the ImplementationAdded event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension TOKENS
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { implementationAddedEvent } from "thirdweb/extensions/tokens";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  implementationAddedEvent({
 *  implementation: ...,
 * })
 * ],
 * });
 * ```
 */
export function implementationAddedEvent(
  filters: ImplementationAddedEventFilters = {},
) {
  return prepareEvent({
    signature:
      "event ImplementationAdded(bytes32 contractId, address indexed implementation, uint8 implementationType, uint8 createHook, bytes createHookData)",
    filters,
  });
}
