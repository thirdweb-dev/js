import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "TransferSingle" event.
 */
export type TransferSingleEventFilters = Partial<{
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
 * Creates an event object for the TransferSingle event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension MODULAR
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { transferSingleEvent } from "thirdweb/extensions/modular";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  transferSingleEvent({
 *  operator: ...,
 *  from: ...,
 *  to: ...,
 * })
 * ],
 * });
 * ```
 */
export function transferSingleEvent(filters: TransferSingleEventFilters = {}) {
  return prepareEvent({
    signature:
      "event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 amount)",
    filters,
  });
}
