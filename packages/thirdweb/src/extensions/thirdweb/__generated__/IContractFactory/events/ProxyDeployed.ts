import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "ProxyDeployed" event.
 */
export type ProxyDeployedEventFilters = Partial<{
  implementation: AbiParameterToPrimitiveType<{
    type: "address";
    name: "implementation";
    indexed: true;
  }>;
  deployer: AbiParameterToPrimitiveType<{
    type: "address";
    name: "deployer";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the ProxyDeployed event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { proxyDeployedEvent } from "thirdweb/extensions/thirdweb";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  proxyDeployedEvent({
 *  implementation: ...,
 *  deployer: ...,
 * })
 * ],
 * });
 * ```
 */
export function proxyDeployedEvent(filters: ProxyDeployedEventFilters = {}) {
  return prepareEvent({
    signature:
      "event ProxyDeployed(address indexed implementation, address proxy, address indexed deployer)",
    filters,
  });
}
