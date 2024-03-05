import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "TransferSingle" event.
 */
export type TransferSingleEventFilters = Partial<{
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
 * Creates an event object for the TransferSingle event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ERC1155
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { transferSingleEvent } from "thirdweb/extensions/erc1155";
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
      "event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value)",
    filters,
  });
}
