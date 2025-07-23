import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "ContractPublished" event.
 */
export type ContractPublishedEventFilters = Partial<{
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
}>;

/**
 * Creates an event object for the ContractPublished event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { contractPublishedEvent } from "thirdweb/extensions/thirdweb";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  contractPublishedEvent({
 *  operator: ...,
 *  publisher: ...,
 * })
 * ],
 * });
 * ```
 */
export function contractPublishedEvent(
  filters: ContractPublishedEventFilters = {},
) {
  return prepareEvent({
    signature:
      "event ContractPublished(address indexed operator, address indexed publisher, (string contractId, uint256 publishTimestamp, string publishMetadataUri, bytes32 bytecodeHash, address implementation) publishedContract)",
    filters,
  });
}
