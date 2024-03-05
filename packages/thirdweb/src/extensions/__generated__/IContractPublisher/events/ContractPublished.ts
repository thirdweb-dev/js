import { prepareEvent } from "../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "ContractPublished" event.
 */
export type ContractPublishedFilters = {
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
};

/**
 * Creates an event object for the ContractPublished event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ICONTRACTPUBLISHER
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { contractPublishedEvent } from "thirdweb/extensions/IContractPublisher";
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
export function contractPublishedEvent(filters: ContractPublishedFilters = {}) {
  return prepareEvent({
    signature:
      "event ContractPublished(address indexed operator, address indexed publisher, (string contractId, uint256 publishTimestamp, string publishMetadataUri, bytes32 bytecodeHash, address implementation) publishedContract)",
    filters,
  });
}
