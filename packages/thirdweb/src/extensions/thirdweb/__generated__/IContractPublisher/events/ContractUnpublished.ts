import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "ContractUnpublished" event.
 */
export type ContractUnpublishedEventFilters = Partial<{
  operator: AbiParameterToPrimitiveType<{
    type: "address";
    name: "operator";
    indexed: true;
  }>;
  publisher: AbiParameterToPrimitiveType<{
    type: "address";
    name: "publisher";
    indexed: true;
  }>;
  contractId: AbiParameterToPrimitiveType<{
    type: "string";
    name: "contractId";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the ContractUnpublished event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { contractUnpublishedEvent } from "thirdweb/extensions/thirdweb";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  contractUnpublishedEvent({
 *  operator: ...,
 *  publisher: ...,
 *  contractId: ...,
 * })
 * ],
 * });
 * ```
 */
export function contractUnpublishedEvent(
  filters: ContractUnpublishedEventFilters = {},
) {
  return prepareEvent({
    signature:
      "event ContractUnpublished(address indexed operator, address indexed publisher, string indexed contractId)",
    filters,
  });
}
