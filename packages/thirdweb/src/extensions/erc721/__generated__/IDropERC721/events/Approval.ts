import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "Approval" event.
 */
export type ApprovalEventFilters = Partial<{
  owner: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "owner";
    type: "address";
  }>;
  approved: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "approved";
    type: "address";
  }>;
  tokenId: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "uint256";
    name: "tokenId";
    type: "uint256";
  }>;
}>;

/**
 * Creates an event object for the Approval event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ERC721
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { approvalEvent } from "thirdweb/extensions/erc721";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  approvalEvent({
 *  owner: ...,
 *  approved: ...,
 *  tokenId: ...,
 * })
 * ],
 * });
 * ```
 */
export function approvalEvent(filters: ApprovalEventFilters = {}) {
  return prepareEvent({
    signature:
      "event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)",
    filters,
  });
}
