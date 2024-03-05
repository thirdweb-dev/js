import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "TransferBatch" event.
 */
export type TransferBatchEventFilters = Partial<{
  operator: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "operator";
    type: "address";
  }>;
  from: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "from";
    type: "address";
  }>;
  to: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "to";
    type: "address";
  }>;
}>;

/**
 * Creates an event object for the TransferBatch event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ERC1155
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { transferBatchEvent } from "thirdweb/extensions/erc1155";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  transferBatchEvent({
 *  operator: ...,
 *  from: ...,
 *  to: ...,
 * })
 * ],
 * });
 * ```
 */
export function transferBatchEvent(filters: TransferBatchEventFilters = {}) {
  return prepareEvent({
    signature:
      "event TransferBatch(address indexed operator, address indexed from, address indexed to, uint256[] ids, uint256[] values)",
    filters,
  });
}
