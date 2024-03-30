import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "SignatureAggregatorChanged" event.
 */
export type SignatureAggregatorChangedEventFilters = Partial<{
  aggregator: AbiParameterToPrimitiveType<{
    type: "address";
    name: "aggregator";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the SignatureAggregatorChanged event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ERC4337
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { signatureAggregatorChangedEvent } from "thirdweb/extensions/erc4337";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  signatureAggregatorChangedEvent({
 *  aggregator: ...,
 * })
 * ],
 * });
 * ```
 */
export function signatureAggregatorChangedEvent(
  filters: SignatureAggregatorChangedEventFilters = {},
) {
  return prepareEvent({
    signature: "event SignatureAggregatorChanged(address indexed aggregator)",
    filters,
  });
}
