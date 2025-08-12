import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the ProxyDeployed event.
 * @returns The prepared event object.
 * @extension TOKENS
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { proxyDeployedEvent } from "thirdweb/extensions/tokens";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  proxyDeployedEvent()
 * ],
 * });
 * ```
 */
export function proxyDeployedEvent() {
  return prepareEvent({
    signature:
      "event ProxyDeployed(bytes32 id, uint256 version, address proxyAddress, address implementation, bytes32 salt)",
  });
}
