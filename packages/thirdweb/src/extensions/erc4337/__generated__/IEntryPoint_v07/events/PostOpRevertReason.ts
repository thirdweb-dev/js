import type { AbiParameterToPrimitiveType } from "abitype";
import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Represents the filters for the "PostOpRevertReason" event.
 */
export type PostOpRevertReasonEventFilters = Partial<{
  userOpHash: AbiParameterToPrimitiveType<{
    type: "bytes32";
    name: "userOpHash";
    indexed: true;
  }>;
  sender: AbiParameterToPrimitiveType<{
    type: "address";
    name: "sender";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the PostOpRevertReason event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ERC4337
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { postOpRevertReasonEvent } from "thirdweb/extensions/erc4337";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  postOpRevertReasonEvent({
 *  userOpHash: ...,
 *  sender: ...,
 * })
 * ],
 * });
 * ```
 */
export function postOpRevertReasonEvent(
  filters: PostOpRevertReasonEventFilters = {},
) {
  return prepareEvent({
    filters,
    signature:
      "event PostOpRevertReason(bytes32 indexed userOpHash, address indexed sender, uint256 nonce, bytes revertReason)",
  });
}
