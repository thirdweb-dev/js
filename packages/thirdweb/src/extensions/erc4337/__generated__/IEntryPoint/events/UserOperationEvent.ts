import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "UserOperationEvent" event.
 */
export type UserOperationEventEventFilters = Partial<{
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
  paymaster: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "paymaster";
    type: "address";
  }>;
}>;

/**
 * Creates an event object for the UserOperationEvent event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ERC4337
 * @example
 * ```
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
