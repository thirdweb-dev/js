import { prepareEvent } from "../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "UserOperationRevertReason" event.
 */
export type UserOperationRevertReasonFilters = {
  userOpHash: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "bytes32";
    name: "userOpHash";
    type: "bytes32";
  }>;
  sender: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "sender";
    type: "address";
  }>;
};

/**
 * Creates an event object for the UserOperationRevertReason event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension IENTRYPOINT
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { userOperationRevertReasonEvent } from "thirdweb/extensions/IEntryPoint";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  userOperationRevertReasonEvent({
 *  userOpHash: ...,
 *  sender: ...,
 * })
 * ],
 * });
 * ```
 */
export function userOperationRevertReasonEvent(
  filters: UserOperationRevertReasonFilters = {},
) {
  return prepareEvent({
    signature:
      "event UserOperationRevertReason(bytes32 indexed userOpHash, address indexed sender, uint256 nonce, bytes revertReason)",
    filters,
  });
}
