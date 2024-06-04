import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "TransferBatch" event.
 */
export type TransferBatchEventFilters = Partial<{
  operator: AbiParameterToPrimitiveType<{
    name: "operator";
    type: "address";
    indexed: true;
    internalType: "address";
  }>;
  from: AbiParameterToPrimitiveType<{
    name: "from";
    type: "address";
    indexed: true;
    internalType: "address";
  }>;
  to: AbiParameterToPrimitiveType<{
    name: "to";
    type: "address";
    indexed: true;
    internalType: "address";
  }>;
}>;

/**
 * Creates an event object for the TransferBatch event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension MODULAR
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { transferBatchEvent } from "thirdweb/extensions/modular";
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
      "event TransferBatch(address indexed operator, address indexed from, address indexed to, uint256[] ids, uint256[] amounts)",
    filters,
  });
}
