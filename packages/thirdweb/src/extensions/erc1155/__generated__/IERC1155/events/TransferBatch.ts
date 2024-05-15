import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "TransferBatch" event.
 */
export type TransferBatchEventFilters = Partial<{
  _operator: AbiParameterToPrimitiveType<{
    type: "address";
    name: "_operator";
    indexed: true;
  }>;
  _from: AbiParameterToPrimitiveType<{
    type: "address";
    name: "_from";
    indexed: true;
  }>;
  _to: AbiParameterToPrimitiveType<{
    type: "address";
    name: "_to";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the TransferBatch event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ERC1155
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { transferBatchEvent } from "thirdweb/extensions/erc1155";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  transferBatchEvent({
 *  _operator: ...,
 *  _from: ...,
 *  _to: ...,
 * })
 * ],
 * });
 * ```
 */
export function transferBatchEvent(filters: TransferBatchEventFilters = {}) {
  return prepareEvent({
    signature:
      "event TransferBatch(address indexed _operator, address indexed _from, address indexed _to, uint256[] tokenIds, uint256[] _values)",
    filters,
  });
}
