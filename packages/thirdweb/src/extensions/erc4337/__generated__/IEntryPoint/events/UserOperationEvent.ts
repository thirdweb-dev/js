import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "UserOperationEvent" event.
 */
export type UserOperationEventEventFilters = Partial<{
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
  paymaster: AbiParameterToPrimitiveType<{
    type: "address";
    name: "paymaster";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the UserOperationEvent event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ERC4337
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { userOperationEventEvent } from "thirdweb/extensions/erc4337";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  userOperationEventEvent({
 *  userOpHash: ...,
 *  sender: ...,
 *  paymaster: ...,
 * })
 * ],
 * });
 * ```
 */
export function userOperationEventEvent(
  filters: UserOperationEventEventFilters = {},
) {
  return prepareEvent({
    signature:
      "event UserOperationEvent(bytes32 indexed userOpHash, address indexed sender, address indexed paymaster, uint256 nonce, bool success, uint256 actualGasCost, uint256 actualGasUsed)",
    filters,
  });
}
