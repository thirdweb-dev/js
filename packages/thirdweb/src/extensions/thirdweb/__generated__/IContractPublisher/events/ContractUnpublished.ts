import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "ContractUnpublished" event.
 */
export type ContractUnpublishedEventFilters = Partial<{
  operator: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "operator";
    type: "address";
  }>;
  publisher: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "publisher";
    type: "address";
  }>;
  contractId: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "string";
    name: "contractId";
    type: "string";
  }>;
}>;

/**
 * Creates an event object for the ContractUnpublished event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension THIRDWEB
 * @example
 * ```
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
