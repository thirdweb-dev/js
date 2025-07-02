import type { AbiParameterToPrimitiveType } from "abitype";
import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Represents the filters for the "AssetInfraDeployed" event.
 */
export type AssetInfraDeployedEventFilters = Partial<{
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
}>;

/**
 * Creates an event object for the AssetInfraDeployed event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ASSETS
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { assetInfraDeployedEvent } from "thirdweb/extensions/assets";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  assetInfraDeployedEvent({
 *  implementation: ...,
 *  proxy: ...,
 * })
 * ],
 * });
 * ```
 */
export function assetInfraDeployedEvent(
  filters: AssetInfraDeployedEventFilters = {},
) {
  return prepareEvent({
    filters,
    signature:
      "event AssetInfraDeployed(address indexed implementation, address indexed proxy, bytes32 inputSalt, bytes data, bytes extraData)",
  });
}
