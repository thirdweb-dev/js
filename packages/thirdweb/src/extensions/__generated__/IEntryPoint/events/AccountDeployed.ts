import { prepareEvent } from "../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "AccountDeployed" event.
 */
export type AccountDeployedFilters = {
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
 * Creates an event object for the AccountDeployed event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension IENTRYPOINT
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { accountDeployedEvent } from "thirdweb/extensions/IEntryPoint";
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
export function accountDeployedEvent(filters: AccountDeployedFilters = {}) {
  return prepareEvent({
    signature:
      "event AccountDeployed(bytes32 indexed userOpHash, address indexed sender, address factory, address paymaster)",
    filters,
  });
}
