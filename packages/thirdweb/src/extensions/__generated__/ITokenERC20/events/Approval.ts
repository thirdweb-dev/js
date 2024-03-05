import { prepareEvent } from "../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "Approval" event.
 */
export type ApprovalFilters = {
  owner: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "owner";
    type: "address";
  }>;
  spender: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "spender";
    type: "address";
  }>;
};

/**
 * Creates an event object for the Approval event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ITOKENERC20
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { approvalEvent } from "thirdweb/extensions/ITokenERC20";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  approvalEvent({
 *  owner: ...,
 *  spender: ...,
 * })
 * ],
 * });
 * ```
 */
export function approvalEvent(filters: ApprovalFilters = {}) {
  return prepareEvent({
    signature:
      "event Approval(address indexed owner, address indexed spender, uint256 value)",
    filters,
  });
}
