import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "AccountDeployed" event.
 */
export type AccountDeployedEventFilters = Partial<{
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
 * Creates an event object for the AccountDeployed event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ERC4337
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { accountDeployedEvent } from "thirdweb/extensions/erc4337";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  accountDeployedEvent({
 *  userOpHash: ...,
 *  sender: ...,
 * })
 * ],
 * });
 * ```
 */
export function accountDeployedEvent(
  filters: AccountDeployedEventFilters = {},
) {
  return prepareEvent({
    signature:
      "event AccountDeployed(bytes32 indexed userOpHash, address indexed sender, address factory, address paymaster)",
    filters,
  });
}
