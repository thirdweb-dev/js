import type { AbiParameterToPrimitiveType } from "abitype";
import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Represents the filters for the "ProxyDeployedV2" event.
 */
export type ProxyDeployedV2EventFilters = Partial<{
  implementation: AbiParameterToPrimitiveType<{
    type: "address";
    name: "implementation";
    indexed: true;
  }>;
  proxy: AbiParameterToPrimitiveType<{
    type: "address";
    name: "proxy";
    indexed: true;
  }>;
  deployer: AbiParameterToPrimitiveType<{
    type: "address";
    name: "deployer";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the ProxyDeployedV2 event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { proxyDeployedV2Event } from "thirdweb/extensions/thirdweb";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  proxyDeployedV2Event({
 *  implementation: ...,
 *  proxy: ...,
 *  deployer: ...,
 * })
 * ],
 * });
 * ```
 */
export function proxyDeployedV2Event(
  filters: ProxyDeployedV2EventFilters = {},
) {
  return prepareEvent({
    filters,
    signature:
      "event ProxyDeployedV2(address indexed implementation, address indexed proxy, address indexed deployer, bytes32 inputSalt, bytes data, bytes extraData)",
  });
}
