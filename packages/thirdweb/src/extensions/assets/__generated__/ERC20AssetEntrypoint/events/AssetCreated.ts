import type { AbiParameterToPrimitiveType } from "abitype";
import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Represents the filters for the "AssetCreated" event.
 */
export type AssetCreatedEventFilters = Partial<{
  creator: AbiParameterToPrimitiveType<{
    type: "address";
    name: "creator";
    indexed: true;
  }>;
  asset: AbiParameterToPrimitiveType<{
    type: "address";
    name: "asset";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the AssetCreated event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ASSETS
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { assetCreatedEvent } from "thirdweb/extensions/assets";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  assetCreatedEvent({
 *  creator: ...,
 *  asset: ...,
 * })
 * ],
 * });
 * ```
 */
export function assetCreatedEvent(filters: AssetCreatedEventFilters = {}) {
  return prepareEvent({
    signature:
      "event AssetCreated(bytes32 contractId, address indexed creator, address indexed asset, address referrer, bytes aux)",
    filters,
  });
}
