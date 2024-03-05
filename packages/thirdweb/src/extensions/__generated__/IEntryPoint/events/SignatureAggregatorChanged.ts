import { prepareEvent } from "../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "SignatureAggregatorChanged" event.
 */
export type SignatureAggregatorChangedFilters = {
  aggregator: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "aggregator";
    type: "address";
  }>;
};

/**
 * Creates an event object for the SignatureAggregatorChanged event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension IENTRYPOINT
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { signatureAggregatorChangedEvent } from "thirdweb/extensions/IEntryPoint";
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
  filters: SignatureAggregatorChangedFilters = {},
) {
  return prepareEvent({
    signature: "event SignatureAggregatorChanged(address indexed aggregator)",
    filters,
  });
}
