import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "ApprovalForAll" event.
 */
export type ApprovalForAllEventFilters = Partial<{
  account: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "account";
    type: "address";
  }>;
  operator: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "operator";
    type: "address";
  }>;
}>;

/**
 * Creates an event object for the ApprovalForAll event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ERC1155
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { approvalForAllEvent } from "thirdweb/extensions/erc1155";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  approvalForAllEvent({
 *  account: ...,
 *  operator: ...,
 * })
 * ],
 * });
 * ```
 */
export function approvalForAllEvent(filters: ApprovalForAllEventFilters = {}) {
  return prepareEvent({
    signature:
      "event ApprovalForAll(address indexed account, address indexed operator, bool approved)",
    filters,
  });
}
